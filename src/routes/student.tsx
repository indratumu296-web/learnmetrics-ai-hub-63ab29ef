import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  BookOpen,
  CalendarCheck,
  Target,
  TrendingUp,
  TriangleAlert,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AppShell } from "@/components/AppShell";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  academicSummary,
  bySubject,
  getStudent,
  students,
  type StudentRecord,
} from "@/lib/learnmetrics";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/student")({
  head: () => ({
    meta: [
      { title: "Student Dashboard — LearnMetrics" },
      {
        name: "description",
        content: "Personal marks, attendance, mastery levels and AI academic insights for each LearnMetrics student.",
      },
      { property: "og:title", content: "Student Dashboard — LearnMetrics" },
      { property: "og:description", content: "Marks, attendance, mastery and AI performance summary." },
    ],
  }),
  component: StudentDashboard,
});

function StudentDashboard() {
  const session = useSession();
  const student =
    (session?.role === "student" ? getStudent(session.id) : undefined) ?? students[0]!;
  const summary = academicSummary(student);

  return (
    <AppShell
      title={`Welcome, ${student.name}`}
      subtitle={`${student.id} · ${student.grade} · Section ${student.className} · Last active ${student.lastActivity}`}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Target} label="Latest score" value={`${student.percentage}%`} hint={`${student.assignment} · ${student.subject}`} />
        <StatCard icon={CalendarCheck} label="Attendance" value={`${student.attendance}%`} hint={student.attendance >= 75 ? "Above requirement" : "Below 75% requirement"} tone={student.attendance >= 75 ? "success" : "danger"} />
        <StatCard icon={TrendingUp} label="Average across tests" value={`${student.averageScore}%`} hint={`${student.testCount} assessments taken`} />
        <StatCard icon={Activity} label="Projected GPA" value={summary.gpa.toFixed(2)} hint={`Cohort rank #${summary.rank} of ${students.length}`} tone="accent" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="size-4 text-primary" /> AI Academic Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              <Badge variant={summary.risk === "High" ? "destructive" : "secondary"}>
                {summary.risk} risk
              </Badge>
              <Badge variant="outline">Mastery: {student.mastery}</Badge>
              <Badge variant="outline">Accuracy: {summary.accuracy}%</Badge>
              <Badge variant="outline">Weak area: {student.missedFacts}</Badge>
            </div>
            <ul className="space-y-2 text-sm leading-relaxed text-muted-foreground">
              {summary.lines.map((line) => (
                <li key={line} className="rounded-xl bg-secondary/60 px-3 py-2">
                  {line}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Skill profile</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart
                data={[
                  { metric: "Score", value: student.percentage },
                  { metric: "Attendance", value: student.attendance },
                  { metric: "Progress", value: student.progress },
                  { metric: "Weekly", value: student.weeklyProgress },
                  { metric: "Practice", value: student.practiceCompleted },
                  { metric: "Accuracy", value: summary.accuracy },
                ]}
              >
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                <Radar dataKey="value" stroke="var(--chart-1)" fill="var(--chart-1)" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="marks" className="mt-6">
        <TabsList>
          <TabsTrigger value="marks">Marks</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="peers">Subject comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="marks">
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Assessment</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Skill</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Correct / Attempted</TableHead>
                    <TableHead className="text-right">Score</TableHead>
                    <TableHead>Mastery</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">{student.assignment}</TableCell>
                    <TableCell>{student.subject}</TableCell>
                    <TableCell>{student.skill}</TableCell>
                    <TableCell>{student.date}</TableCell>
                    <TableCell className="text-right">
                      {student.correct} / {student.attempted}
                    </TableCell>
                    <TableCell className="text-right font-semibold">{student.score}/100</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{student.mastery}</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  { label: "Course progress", value: student.progress },
                  { label: "Weekly progress", value: student.weeklyProgress },
                  { label: "Practice completed", value: student.practiceCompleted },
                ].map((m) => (
                  <div key={m.label}>
                    <div className="mb-2 flex justify-between text-sm">
                      <span className="text-muted-foreground">{m.label}</span>
                      <span className="font-medium">{m.value}%</span>
                    </div>
                    <Progress value={m.value} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <Card>
            <CardContent className="h-80 pt-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceTrend(student)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                  <YAxis domain={[50, 100]} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
                  <Legend />
                  <Line type="monotone" dataKey="attendance" name="Attendance %" stroke="var(--chart-1)" strokeWidth={2.5} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="target" name="Required 75%" stroke="var(--chart-5)" strokeDasharray="5 5" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="peers">
          <Card>
            <CardContent className="h-80 pt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bySubject().map((s) => ({ ...s, isMine: s.subject === student.subject }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="subject" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                  <YAxis tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
                  <Bar dataKey="averageScore" name="Cohort average %" radius={[8, 8, 0, 0]}>
                    {bySubject().map((s) => (
                      <Cell key={s.subject} fill={s.subject === student.subject ? "var(--chart-2)" : "var(--chart-1)"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {student.needsAttention ? (
        <Card className="mt-6 border-destructive/40">
          <CardContent className="flex items-start gap-3 pt-6 text-sm">
            <TriangleAlert className="mt-0.5 size-5 text-destructive" />
            <p className="text-muted-foreground">
              This learner is flagged as <strong>needs attention</strong> in the dataset. Recommended
              action: schedule remedial practice on <strong>{student.missedFacts}</strong> and review
              attendance with the class mentor.
            </p>
          </CardContent>
        </Card>
      ) : null}
    </AppShell>
  );
}

function attendanceTrend(student: StudentRecord) {
  const base = student.attendance;
  return ["Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((month, i) => ({
    month,
    attendance: Math.max(45, Math.min(100, Math.round(base - 6 + ((student.score + i * 13) % 13)))),
    target: 75,
  }));
}
