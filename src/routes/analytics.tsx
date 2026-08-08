import { createFileRoute } from "@tanstack/react-router";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";

import { AppShell } from "@/components/AppShell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  byGrade,
  bySubject,
  classHeatmap,
  cohortStats,
  lowestPerformers,
  monthlyTrend,
  students,
} from "@/lib/learnmetrics";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — LearnMetrics BI Dashboard" },
      {
        name: "description",
        content: "Interactive BI-style analytics: trends, grade comparison, class heat map, correlation and at-risk analysis.",
      },
      { property: "og:title", content: "Analytics — LearnMetrics BI Dashboard" },
      { property: "og:description", content: "Trends, heat maps and correlations across the full learning dataset." },
    ],
  }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const stats = cohortStats();
  const heat = classHeatmap();
  const scatter = students.map((s) => ({ attendance: s.attendance, score: s.percentage, z: s.testCount }));

  const heatColor = (value: number) => {
    if (!value) return "var(--muted)";
    if (value >= 85) return "var(--chart-3)";
    if (value >= 75) return "var(--chart-2)";
    if (value >= 65) return "var(--chart-4)";
    return "var(--chart-5)";
  };

  return (
    <AppShell
      title="Analytics Dashboard"
      subtitle={`${stats.total} records · ${stats.passPercentage}% pass rate · ${stats.atRisk} learners flagged`}
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Score & attendance trend</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyTrend()}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Legend />
                <Area type="monotone" dataKey="score" name="Average score %" stroke="var(--chart-1)" fill="url(#g1)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="attendance" name="Attendance %" stroke="var(--chart-2)" fill="transparent" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Grade comparison</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byGrade()}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="grade" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                <YAxis tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Legend />
                <Bar dataKey="averageScore" name="Score %" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
                <Bar dataKey="progress" name="Progress %" fill="var(--chart-3)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Attendance vs score correlation</CardTitle></CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" dataKey="attendance" name="Attendance %" domain={[60, 100]} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                <YAxis type="number" dataKey="score" name="Score %" domain={[30, 100]} tick={{ fontSize: 12, fill: "var(--muted-foreground)" }} />
                <ZAxis type="number" dataKey="z" range={[40, 200]} />
                <Tooltip cursor={{ strokeDasharray: "3 3" }} contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }} />
                <Scatter data={scatter} fill="var(--chart-2)" fillOpacity={0.7} />
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Grade × section heat map</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-1 text-sm">
                <thead>
                  <tr>
                    <th className="p-2 text-left text-xs font-medium text-muted-foreground">Grade</th>
                    {heat.classes.map((c) => (
                      <th key={c} className="p-2 text-xs font-medium text-muted-foreground">Section {c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {heat.grades.map((g) => (
                    <tr key={g}>
                      <td className="p-2 text-xs font-medium">{g}</td>
                      {heat.classes.map((c) => {
                        const cell = heat.cells.find((x) => x.grade === g && x.className === c)!;
                        return (
                          <td key={c} className="p-0">
                            <div
                              className="rounded-lg px-2 py-3 text-center text-xs font-semibold text-primary-foreground"
                              style={{ background: heatColor(cell.averageScore) }}
                              title={`${cell.students} students`}
                            >
                              {cell.averageScore || "—"}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Cell value = average score %. Green ≥ 85, teal ≥ 75, amber ≥ 65, red below 65.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Subject performance table</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {bySubject().map((s) => (
              <div key={s.subject} className="flex items-center justify-between rounded-xl bg-secondary/60 px-4 py-3 text-sm">
                <span className="font-medium">{s.subject}</span>
                <span className="text-muted-foreground">
                  {s.students} students · {s.attendance}% attendance · {s.atRisk} at risk
                </span>
                <span className="font-semibold text-primary">{s.averageScore}%</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Lowest performers requiring intervention</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {lowestPerformers(6).map((s) => (
              <div key={s.id} className="flex items-center justify-between rounded-xl border px-4 py-3 text-sm">
                <div className="min-w-0">
                  <p className="truncate font-medium">{s.name} <span className="text-xs text-muted-foreground">({s.id})</span></p>
                  <p className="text-xs text-muted-foreground">{s.subject} · weak in {s.missedFacts}</p>
                </div>
                <span className="font-semibold text-destructive">{s.percentage}%</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
