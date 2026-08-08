import rows from "@/data/students.json";

export type StudentRecord = {
  id: string;
  name: string;
  grade: string;
  className: string;
  subject: string;
  skill: string;
  assignment: string;
  date: string;
  score: number;
  percentage: number;
  mastery: string;
  attempted: number;
  correct: number;
  incorrect: number;
  missedFacts: string;
  practiceCompleted: number;
  attendance: number;
  weeklyProgress: number;
  needsAttention: boolean;
  lastActivity: string;
  testCount: number;
  averageScore: number;
  progress: number;
};

/** Full dataset parsed from student_learning_dataset_120_students.csv */
export const students: StudentRecord[] = rows as StudentRecord[];

export const avg = (values: number[]) =>
  values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;

export const round = (n: number, digits = 1) => Number(n.toFixed(digits));

export function getStudent(id: string) {
  return students.find((s) => s.id.toLowerCase() === id.toLowerCase());
}

export function cohortStats(list: StudentRecord[] = students) {
  const atRisk = list.filter((s) => s.needsAttention);
  const presentToday = list.filter((s) => s.attendance >= 75);
  return {
    total: list.length,
    averageScore: round(avg(list.map((s) => s.percentage))),
    averageAttendance: round(avg(list.map((s) => s.attendance))),
    averageProgress: round(avg(list.map((s) => s.progress))),
    passPercentage: round((list.filter((s) => s.percentage >= 60).length / (list.length || 1)) * 100),
    atRisk: atRisk.length,
    presentToday: presentToday.length,
    absentToday: list.length - presentToday.length,
    assessments: list.reduce((a, s) => a + s.testCount, 0),
  };
}

export function bySubject(list: StudentRecord[] = students) {
  const map = new Map<string, StudentRecord[]>();
  for (const s of list) map.set(s.subject, [...(map.get(s.subject) ?? []), s]);
  return [...map.entries()]
    .map(([subject, items]) => ({
      subject,
      students: items.length,
      averageScore: round(avg(items.map((i) => i.percentage))),
      attendance: round(avg(items.map((i) => i.attendance))),
      atRisk: items.filter((i) => i.needsAttention).length,
    }))
    .sort((a, b) => b.averageScore - a.averageScore);
}

export function byGrade(list: StudentRecord[] = students) {
  const map = new Map<string, StudentRecord[]>();
  for (const s of list) map.set(s.grade, [...(map.get(s.grade) ?? []), s]);
  return [...map.entries()]
    .map(([grade, items]) => ({
      grade,
      students: items.length,
      averageScore: round(avg(items.map((i) => i.percentage))),
      attendance: round(avg(items.map((i) => i.attendance))),
      progress: round(avg(items.map((i) => i.progress))),
    }))
    .sort((a, b) => a.grade.localeCompare(b.grade, undefined, { numeric: true }));
}

export function masteryDistribution(list: StudentRecord[] = students) {
  const order = ["Advanced", "Proficient", "Developing", "Beginning"];
  return order.map((level) => ({
    level,
    count: list.filter((s) => s.mastery === level).length,
  }));
}

export function monthlyTrend(list: StudentRecord[] = students) {
  const map = new Map<string, StudentRecord[]>();
  for (const s of list) {
    const month = s.date.slice(0, 7);
    map.set(month, [...(map.get(month) ?? []), s]);
  }
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, items]) => ({
      month: new Date(`${month}-01`).toLocaleDateString("en-US", { month: "short" }),
      score: round(avg(items.map((i) => i.percentage))),
      attendance: round(avg(items.map((i) => i.attendance))),
      assessments: items.length,
    }));
}

export function topPerformers(n = 5, list: StudentRecord[] = students) {
  return [...list].sort((a, b) => b.percentage - a.percentage).slice(0, n);
}

export function lowestPerformers(n = 5, list: StudentRecord[] = students) {
  return [...list].sort((a, b) => a.percentage - b.percentage).slice(0, n);
}

export function classHeatmap(list: StudentRecord[] = students) {
  const grades = [...new Set(list.map((s) => s.grade))].sort((a, b) =>
    a.localeCompare(b, undefined, { numeric: true }),
  );
  const classes = [...new Set(list.map((s) => s.className))].sort();
  return { grades, classes,
    cells: grades.flatMap((grade) =>
      classes.map((className) => {
        const items = list.filter((s) => s.grade === grade && s.className === className);
        return {
          grade,
          className,
          students: items.length,
          averageScore: items.length ? round(avg(items.map((i) => i.percentage))) : 0,
        };
      }),
    ),
  };
}

export function rankOf(student: StudentRecord) {
  const sorted = [...students].sort((a, b) => b.percentage - a.percentage);
  return sorted.findIndex((s) => s.id === student.id) + 1;
}

export function predictedGpa(student: StudentRecord) {
  const blended = student.percentage * 0.5 + student.averageScore * 0.3 + student.progress * 0.2;
  return round(Math.min(10, (blended / 100) * 10 + (student.attendance >= 85 ? 0.2 : 0)), 2);
}

export function riskLevel(student: StudentRecord): "High" | "Medium" | "Low" {
  if (student.needsAttention && student.percentage < 60) return "High";
  if (student.needsAttention || student.attendance < 75 || student.percentage < 70) return "Medium";
  return "Low";
}

/** Rule-based generative summary built entirely from the student's real dataset row. */
export function academicSummary(student: StudentRecord) {
  const subjectAvg = round(
    avg(students.filter((s) => s.subject === student.subject).map((s) => s.percentage)),
  );
  const delta = round(student.percentage - subjectAvg);
  const accuracy = round((student.correct / (student.attempted || 1)) * 100);
  return {
    rank: rankOf(student),
    subjectAvg,
    delta,
    accuracy,
    gpa: predictedGpa(student),
    risk: riskLevel(student),
    lines: [
      `${student.name} is currently at ${student.percentage}% in ${student.subject}, which is ${
        delta >= 0 ? `${delta} points above` : `${Math.abs(delta)} points below`
      } the ${student.subject} cohort average of ${subjectAvg}%.`,
      `Mastery level is ${student.mastery} for ${student.skill}, with ${accuracy}% question accuracy across ${student.attempted} attempted questions.`,
      `Attendance stands at ${student.attendance}%${
        student.attendance < 75 ? " — below the 75% requirement, which needs immediate attention." : " and is within the safe range."
      }`,
      `The weakest area is ${student.missedFacts}; targeted practice here should lift the next assessment by an estimated ${Math.max(4, 100 - student.percentage > 20 ? 8 : 5)} points.`,
      `Projected GPA for this term is ${predictedGpa(student)} with a ${riskLevel(student).toLowerCase()} risk profile.`,
    ],
  };
}
