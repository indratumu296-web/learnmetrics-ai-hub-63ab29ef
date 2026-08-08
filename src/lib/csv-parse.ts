/** Minimal RFC4180-ish CSV parser (handles quoted fields and embedded commas). */
export function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  const pushField = () => {
    row.push(field);
    field = "";
  };
  const pushRow = () => {
    pushField();
    if (row.some((c) => c.trim() !== "")) rows.push(row);
    row = [];
  };

  const src = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < src.length; i += 1) {
    const char = src[i];
    if (quoted) {
      if (char === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i += 1;
        } else quoted = false;
      } else field += char;
      continue;
    }
    if (char === '"') quoted = true;
    else if (char === ",") pushField();
    else if (char === "\n") pushRow();
    else if (char !== "\r") field += char;
  }
  if (field !== "" || row.length) pushRow();

  const [header, ...body] = rows;
  if (!header) return [];
  return body.map((cells) =>
    Object.fromEntries(header.map((key, i) => [key.trim(), (cells[i] ?? "").trim()])),
  );
}

export const REQUIRED_CSV_COLUMNS = [
  "student_id",
  "student_name",
  "grade",
  "class_name",
  "subject",
  "skill",
  "assignment_name",
  "assignment_date",
  "score",
  "percentage",
  "mastery_level",
  "attendance_percentage",
];
