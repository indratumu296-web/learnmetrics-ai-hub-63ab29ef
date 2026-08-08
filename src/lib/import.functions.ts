import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type { Database } from "@/integrations/supabase/types";
import { parseCsv } from "@/lib/csv-parse";

type StudentRow = Database["public"]["Tables"]["students"]["Insert"];
type MarkRow = Database["public"]["Tables"]["marks"]["Insert"];
type AttendanceRow = Database["public"]["Tables"]["attendance"]["Insert"];

const inputSchema = z.object({
  passcode: z.string().min(1),
  fileName: z.string().default("student_learning_dataset_120_students.csv"),
  csvText: z.string().optional(),
  replaceExisting: z.boolean().default(false),
});

const num = (value: string | undefined) => {
  const parsed = Number.parseFloat(String(value ?? "").replace(/[%\s]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};
const int = (value: string | undefined) => Math.round(num(value));
const date = (value: string | undefined) => {
  const raw = String(value ?? "").trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : null;
};

export const importStudentCsv = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }) => {
    if (data.passcode !== process.env["ADMIN_IMPORT_PASSCODE"]) {
      return { ok: false as const, error: "Invalid admin passcode." };
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    let csvText = data.csvText;
    if (!csvText) {
      const bundled = await import("@/data/student_learning_dataset_120_students.csv?raw");
      csvText = bundled.default as string;
    }

    const rows = parseCsv(csvText);
    if (rows.length === 0) {
      return { ok: false as const, error: "The CSV file contained no data rows." };
    }
    if (!("student_id" in rows[0]!)) {
      return { ok: false as const, error: "Missing required column: student_id." };
    }

    const studentMap = new Map<string, StudentRow>();
    const marks: MarkRow[] = [];
    const attendance: AttendanceRow[] = [];
    const seenMarks = new Set<string>();
    const seenAttendance = new Set<string>();

    for (const row of rows) {
      const id = (row["student_id"] ?? "").trim();
      if (!id) continue;

      studentMap.set(id, {
        id,
        name: row["student_name"] ?? "",
        grade: row["grade"] ?? "",
        class_name: row["class_name"] ?? "",
        subject: row["subject"] ?? "",
        skill: row["skill"] ?? "",
        mastery: row["mastery_level"] ?? "",
        needs_attention: /^(yes|true|1)$/i.test(row["needs_attention"] ?? ""),
        updated_at: new Date().toISOString(),
      });

      const assignment = row["assignment_name"] ?? "";
      const assessedOn = date(row["assignment_date"]);
      const markKey = `${id}|${assignment}|${assessedOn}`;
      if (!seenMarks.has(markKey)) {
        seenMarks.add(markKey);
        marks.push({
          student_id: id,
          assignment,
          subject: row["subject"] ?? "",
          skill: row["skill"] ?? "",
          assessed_on: assessedOn,
          score: num(row["score"]),
          percentage: num(row["percentage"]),
          attempted: int(row["questions_attempted"]),
          correct: int(row["questions_correct"]),
          incorrect: int(row["questions_incorrect"]),
          missed_facts: row["missed_facts"] ?? "",
          mastery: row["mastery_level"] ?? "",
          test_count: int(row["test_count"]),
          average_score: num(row["average_score"]),
          progress: num(row["progress_percentage"]),
        });
      }

      const recordedOn = date(row["last_activity_date"]) ?? assessedOn;
      const attKey = `${id}|${recordedOn}`;
      if (!seenAttendance.has(attKey)) {
        seenAttendance.add(attKey);
        attendance.push({
          student_id: id,
          recorded_on: recordedOn,
          attendance_percentage: num(row["attendance_percentage"]),
          practice_completed: int(row["practice_completed"]),
          weekly_progress: num(row["weekly_progress"]),
          last_activity: row["last_activity_date"] ?? "",
        });
      }
    }

    const students = [...studentMap.values()];

    try {
      if (data.replaceExisting) {
        await supabaseAdmin.from("marks").delete().neq("student_id", "");
        await supabaseAdmin.from("attendance").delete().neq("student_id", "");
        await supabaseAdmin.from("students").delete().neq("id", "");
      }

      const chunk = <T,>(list: T[], size = 200) =>
        Array.from({ length: Math.ceil(list.length / size) }, (_, i) =>
          list.slice(i * size, i * size + size),
        );

      for (const part of chunk(students)) {
        const { error } = await supabaseAdmin.from("students").upsert(part, { onConflict: "id" });
        if (error) throw new Error(`students: ${error.message}`);
      }
      for (const part of chunk(marks)) {
        const { error } = await supabaseAdmin
          .from("marks")
          .upsert(part, { onConflict: "student_id,assignment,assessed_on" });
        if (error) throw new Error(`marks: ${error.message}`);
      }
      for (const part of chunk(attendance)) {
        const { error } = await supabaseAdmin
          .from("attendance")
          .upsert(part, { onConflict: "student_id,recorded_on" });
        if (error) throw new Error(`attendance: ${error.message}`);
      }

      await supabaseAdmin.from("import_runs").insert({
        file_name: data.fileName,
        rows_read: rows.length,
        students_written: students.length,
        marks_written: marks.length,
        attendance_written: attendance.length,
        status: "success",
      });

      return {
        ok: true as const,
        rowsRead: rows.length,
        students: students.length,
        marks: marks.length,
        attendance: attendance.length,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown import error";
      await supabaseAdmin.from("import_runs").insert({
        file_name: data.fileName,
        rows_read: rows.length,
        status: "failed",
        error_message: message,
      });
      return { ok: false as const, error: message };
    }
  });
