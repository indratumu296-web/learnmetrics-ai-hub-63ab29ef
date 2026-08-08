import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CheckCircle2, Database, FileSpreadsheet, Loader2, TriangleAlert, UploadCloud } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { importStudentCsv } from "@/lib/import.functions";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/admin_/import")({
  head: () => ({
    meta: [
      { title: "CSV Import — LearnMetrics Admin" },
      {
        name: "description",
        content:
          "Import the student learning dataset CSV and automatically populate the students, marks and attendance tables.",
      },
      { property: "og:title", content: "CSV Import — LearnMetrics Admin" },
      {
        property: "og:description",
        content: "Admin workflow that turns the student learning CSV into structured student, marks and attendance records.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ImportPage,
});

const DEFAULT_FILE = "student_learning_dataset_120_students.csv";

type ImportRun = {
  id: string;
  file_name: string;
  rows_read: number;
  students_written: number;
  marks_written: number;
  attendance_written: number;
  status: string;
  error_message: string | null;
  created_at: string;
};

function ImportPage() {
  const session = useSession();
  const runImport = useServerFn(importStudentCsv);

  const [passcode, setPasscode] = useState("");
  const [replaceExisting, setReplaceExisting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const [counts, setCounts] = useState({ students: 0, marks: 0, attendance: 0 });
  const [runs, setRuns] = useState<ImportRun[]>([]);

  const refresh = useCallback(async () => {
    const [students, marks, attendance, history] = await Promise.all([
      supabase.from("students").select("*", { count: "exact", head: true }),
      supabase.from("marks").select("*", { count: "exact", head: true }),
      supabase.from("attendance").select("*", { count: "exact", head: true }),
      supabase.from("import_runs").select("*").order("created_at", { ascending: false }).limit(8),
    ]);
    setCounts({
      students: students.count ?? 0,
      marks: marks.count ?? 0,
      attendance: attendance.count ?? 0,
    });
    setRuns((history.data ?? []) as ImportRun[]);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const handleImport = async () => {
    setBusy(true);
    setMessage(null);
    try {
      const csvText = file ? await file.text() : undefined;
      const result = await runImport({
        data: {
          passcode,
          fileName: file?.name ?? DEFAULT_FILE,
          csvText,
          replaceExisting,
        },
      });
      if (result.ok) {
        setMessage({
          tone: "ok",
          text: `Imported ${result.rowsRead} rows — ${result.students} students, ${result.marks} marks and ${result.attendance} attendance records written.`,
        });
      } else {
        setMessage({ tone: "error", text: result.error });
      }
    } catch (error) {
      setMessage({
        tone: "error",
        text: error instanceof Error ? error.message : "The import failed unexpectedly.",
      });
    } finally {
      setBusy(false);
      void refresh();
    }
  };

  if (session?.role !== "admin") {
    return (
      <AppShell title="CSV Import" subtitle="Admin access required">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-base">Admins only</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>Sign in with an admin account to run the dataset import.</p>
            <Button asChild>
              <Link to="/login">Go to sign in</Link>
            </Button>
          </CardContent>
        </Card>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Dataset CSV Import"
      subtitle="Parse the student learning CSV and populate the students, marks and attendance tables automatically"
    >
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Students in database", value: counts.students, icon: Database },
          { label: "Marks records", value: counts.marks, icon: FileSpreadsheet },
          { label: "Attendance records", value: counts.attendance, icon: CheckCircle2 },
        ].map((item) => (
          <Card key={item.label}>
            <CardContent className="flex items-center gap-4 py-6">
              <span className="gradient-primary flex size-11 items-center justify-center rounded-2xl">
                <item.icon className="size-5 text-primary-foreground" />
              </span>
              <div>
                <p className="text-2xl font-semibold">{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-6 max-w-3xl">
        <CardHeader>
          <CardTitle className="text-base">Run import</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="rounded-2xl border border-dashed p-4 text-sm text-muted-foreground">
            Leave the file picker empty to import the bundled{" "}
            <span className="font-mono text-xs text-foreground">{DEFAULT_FILE}</span>, or upload a CSV with the same
            column headers. Rows are matched on student ID, assignment and date, so re-running the import updates
            records instead of duplicating them.
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="csv">CSV file (optional)</Label>
              <Input
                id="csv"
                type="file"
                accept=".csv,text/csv"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="passcode">Admin import passcode</Label>
              <Input
                id="passcode"
                type="password"
                value={passcode}
                placeholder="Enter admin passcode"
                onChange={(e) => setPasscode(e.target.value)}
              />
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="size-4 accent-[var(--primary)]"
              checked={replaceExisting}
              onChange={(e) => setReplaceExisting(e.target.checked)}
            />
            Replace all existing records before importing
          </label>

          <Button onClick={handleImport} disabled={busy || passcode.length === 0}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : <UploadCloud className="size-4" />}
            {busy ? "Importing…" : "Import dataset"}
          </Button>

          {message ? (
            <div
              className={`flex items-start gap-2 rounded-xl border p-3 text-sm ${
                message.tone === "ok" ? "text-primary" : "text-destructive"
              }`}
            >
              {message.tone === "ok" ? (
                <CheckCircle2 className="mt-0.5 size-4" />
              ) : (
                <TriangleAlert className="mt-0.5 size-4" />
              )}
              <span>{message.text}</span>
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Import history</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>When</TableHead>
                <TableHead>File</TableHead>
                <TableHead className="text-right">Rows</TableHead>
                <TableHead className="text-right">Students</TableHead>
                <TableHead className="text-right">Marks</TableHead>
                <TableHead className="text-right">Attendance</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {runs.map((run) => (
                <TableRow key={run.id}>
                  <TableCell className="whitespace-nowrap text-xs text-muted-foreground">
                    {new Date(run.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell className="max-w-[16rem] truncate font-mono text-xs">{run.file_name}</TableCell>
                  <TableCell className="text-right">{run.rows_read}</TableCell>
                  <TableCell className="text-right">{run.students_written}</TableCell>
                  <TableCell className="text-right">{run.marks_written}</TableCell>
                  <TableCell className="text-right">{run.attendance_written}</TableCell>
                  <TableCell>
                    <Badge variant={run.status === "success" ? "secondary" : "destructive"}>
                      {run.status === "success" ? "Success" : run.error_message ?? "Failed"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {runs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                    No imports have been run yet.
                  </TableCell>
                </TableRow>
              ) : null}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </AppShell>
  );
}
