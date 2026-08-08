import { createFileRoute, Link } from "@tanstack/react-router";
import { BarChart3, Bot, GraduationCap, LineChart, ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cohortStats, bySubject } from "@/lib/learnmetrics";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "LearnMetrics — AI Student Performance Analytics" },
      {
        name: "description",
        content:
          "LearnMetrics turns marks, attendance and assessment data into AI-powered insights, dashboards and risk predictions for schools and colleges.",
      },
      { property: "og:title", content: "LearnMetrics — AI Student Performance Analytics" },
      {
        property: "og:description",
        content: "Measure Learning. Predict Success. Dashboards, AI insights and risk prediction from real student data.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: BarChart3,
    title: "Analytics Dashboards",
    text: "Subject, grade and class-wise performance with heat maps, trends and pass percentage.",
  },
  {
    icon: Bot,
    title: "AI Academic Assistant",
    text: "Ask about attendance, marks, weak skills or study plans and get answers from real records.",
  },
  {
    icon: LineChart,
    title: "Risk Prediction",
    text: "Projected GPA, at-risk flags and improvement targets computed for every learner.",
  },
  {
    icon: ShieldCheck,
    title: "Role-Based Access",
    text: "Separate admin/faculty and student experiences with scoped dashboards.",
  },
];

function Landing() {
  const stats = cohortStats();
  const subjects = bySubject();

  return (
    <div className="min-h-screen bg-background">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2">
          <span className="gradient-primary flex size-9 items-center justify-center rounded-xl">
            <GraduationCap className="size-5 text-primary-foreground" />
          </span>
          <span className="text-lg font-semibold tracking-tight">LearnMetrics</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link to="/analytics">Analytics</Link>
          </Button>
          <Button asChild>
            <Link to="/login">Sign in</Link>
          </Button>
        </div>
      </header>

      <section className="gradient-hero relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 py-20 text-primary-foreground md:py-28">
          <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/25 px-3 py-1 text-xs font-medium">
            <Sparkles className="size-3.5" /> Mantra Ignite 2026 · AI + Analytics
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Measure Learning. <span className="opacity-80">Predict Success.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base opacity-90 md:text-lg">
            An AI-powered student performance analytics platform. LearnMetrics reads your learning
            dataset and turns marks, attendance, mastery levels and skill gaps into dashboards,
            predictions and personalised guidance.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" variant="secondary" asChild>
              <Link to="/login">Open the portal</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/analytics">View analytics</Link>
            </Button>
          </div>

          <dl className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { label: "Students tracked", value: stats.total },
              { label: "Average score", value: `${stats.averageScore}%` },
              { label: "Average attendance", value: `${stats.averageAttendance}%` },
              { label: "Students at risk", value: stats.atRisk },
            ].map((s) => (
              <div key={s.label} className="glass-panel rounded-2xl px-4 py-4">
                <dt className="text-xs uppercase tracking-wide opacity-80">{s.label}</dt>
                <dd className="mt-1 text-2xl font-semibold">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          Everything a modern academic team needs
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Card key={f.title} className="shadow-soft">
              <CardContent className="pt-6">
                <span className="flex size-10 items-center justify-center rounded-xl bg-secondary">
                  <f.icon className="size-5 text-primary" />
                </span>
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-20">
        <Card className="shadow-elegant">
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold">Live subject performance from your dataset</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {subjects.map((s) => (
                <div key={s.subject} className="rounded-2xl border p-4">
                  <p className="text-sm font-medium">{s.subject}</p>
                  <p className="mt-2 text-3xl font-semibold text-primary">{s.averageScore}%</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {s.students} students · {s.atRisk} need attention
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      <footer className="border-t px-6 py-8 text-center text-sm text-muted-foreground">
        LearnMetrics · AI-Powered Student Performance Analytics Platform
      </footer>
    </div>
  );
}
