import { createFileRoute } from "@tanstack/react-router";
import {
  CalendarCheck,
  ClipboardList,
  GaugeCircle,
  TriangleAlert,
  UserCheck,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { AppShell } from "@/components/AppShell";
import { StatCard } from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  bySubject,
  cohortStats,
  masteryDistribution,
  riskLevel,
  students,
  topPerformers,
} from "@/lib/learnmetrics";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — LearnMetrics" },
      {
        name: "description",
        content: "Manage students, monitor attendance and marks, and review at-risk learners across every grade and section.",
      },
      { property: "og:title", content: "Admin Dashboard — LearnMetrics" },
      { property: "og:description", content: "Cohort KPIs, student records and at-risk monitoring." },
    ],
  }),
  component: AdminRoute,
});

function AdminRoute() {
  const session = useSession();
  if (session?.role !== "admin") {
    return (
      <AppShell title="Admin & Faculty Dashboard" subtitle="Restricted area">
        <RequireRole role="admin">{null}</RequireRole>
      </AppShell>
    );
  }
  return <AdminDashboard />;
}

const PAGE_SIZE = 10;

function AdminDashboard() {
  const [query, setQuery] = useState("");
  const [grade, setGrade] = useState("all");
  const [subject, setSubject] = useState("all");
  const [page, setPage] = useState(0);

  const grades = useMemo(() => [...new Set(students.map((s) => s.grade))].sort(), []);
  const subjects = useMemo(() => [...new Set(students.map((s) => s.subject))].sort(), []);

  const filtered = useMemo(
    () =>
      students.filter(
        (s) =>
          (grade === "all" || s.grade === grade) &&
          (subject === "all" || s.subject === subject) &&
          (s.name.toLowerCase().includes(query.toLowerCase()) ||
            s.id.toLowerCase().includes(query.toLowerCase())),
      ),
    [query, grade, subject],
  );

  const stats = cohortStats(filtered);
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount - 1);
  const rows = filtered.slice(current * PAGE_SIZE, current * PAGE_SIZE + PAGE_SIZE);
  const mastery = masteryDistribution(filtered);
  const masteryColors = ["var(--chart-3)", "var(--chart-1)", "var(--chart-4)", "var(--chart-5)"];

  return (
    <AppShell
      title="Admin & Faculty Dashboard"
      subtitle="Cohort health, student records and at-risk monitoring from the uploaded learning dataset"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <StatCard icon={Users} label="Total students" value={stats.total} />
        <StatCard icon={UserCheck} label="Attendance ≥ 75%" value={stats.presentToday} tone="success" />
        <StatCard icon={TriangleAlert} label="Needs attention" value={stats.atRisk} tone="danger" />
        <StatCard icon={GaugeCircle} label="Average score" value={`${stats.averageScore}%`} tone="accent" />
        <StatCard icon={CalendarCheck} label="Avg attendance" value={`${stats.averageAttendance}%`} />
        <StatCard icon={ClipboardList} label="Assessments" value={stats.assessments} tone="warning" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Subject-wise average score</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bySubject(filtered)}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="subject" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                <YAxis tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Bar dataKey="averageScore" name="Average %" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="attendance" name="Attendance %" fill="var(--chart-2)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Mastery distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={mastery} dataKey="count" nameKey="level" innerRadius={55} outerRadius={95} paddingAngle={3}>
                  {mastery.map((entry, i) => (
                    <Cell key={entry.level} fill={masteryColors[i % masteryColors.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {mastery.map((m, i) => (
                <span key={m.level} className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full" style={{ background: masteryColors[i] }} />
                  {m.level} · {m.count}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-base">Student records ({filtered.length})</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Input
              placeholder="Search name or ID…"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(0);
              }}
              className="w-full sm:w-52"
            />
            <Select value={grade} onValueChange={(v) => { setGrade(v); setPage(0); }}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Grade" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All grades</SelectItem>
                {grades.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={subject} onValueChange={(v) => { setSubject(v); setPage(0); }}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Subject" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All subjects</SelectItem>
                {subjects.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Grade / Section</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Skill</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead className="text-right">Attendance</TableHead>
                  <TableHead>Mastery</TableHead>
                  <TableHead>Risk</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((s) => {
                  const risk = riskLevel(s);
                  return (
                    <TableRow key={s.id}>
                      <TableCell className="font-mono text-xs">{s.id}</TableCell>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell>{s.grade} · {s.className}</TableCell>
                      <TableCell>{s.subject}</TableCell>
                      <TableCell className="text-muted-foreground">{s.skill}</TableCell>
                      <TableCell className="text-right font-semibold">{s.percentage}%</TableCell>
                      <TableCell className="text-right">{s.attendance}%</TableCell>
                      <TableCell><Badge variant="secondary">{s.mastery}</Badge></TableCell>
                      <TableCell>
                        <Badge variant={risk === "High" ? "destructive" : risk === "Medium" ? "outline" : "secondary"}>
                          {risk}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {rows.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="py-10 text-center text-muted-foreground">
                      No students match these filters.
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>Page {current + 1} of {pageCount}</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={current === 0} onClick={() => setPage(current - 1)}>Previous</Button>
              <Button variant="outline" size="sm" disabled={current >= pageCount - 1} onClick={() => setPage(current + 1)}>Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Top performers</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {topPerformers(5, filtered).map((s, i) => (
            <div key={s.id} className="rounded-2xl border p-4">
              <p className="text-xs text-muted-foreground">#{i + 1} · {s.grade}</p>
              <p className="mt-1 truncate font-medium">{s.name}</p>
              <p className="mt-2 text-2xl font-semibold text-primary">{s.percentage}%</p>
              <p className="text-xs text-muted-foreground">{s.subject}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </AppShell>
  );
}
