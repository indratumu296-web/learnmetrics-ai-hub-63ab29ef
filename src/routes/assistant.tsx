import { createFileRoute } from "@tanstack/react-router";
import { Bot, Send, Sparkles, User } from "lucide-react";
import { useState } from "react";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  academicSummary,
  bySubject,
  cohortStats,
  getStudent,
  lowestPerformers,
  students,
  topPerformers,
} from "@/lib/learnmetrics";
import { useSession } from "@/lib/session";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Assistant — LearnMetrics" },
      {
        name: "description",
        content: "Ask the LearnMetrics assistant about attendance, marks, weak skills, study plans and exam schedules — answered from real records.",
      },
      { property: "og:title", content: "AI Assistant — LearnMetrics" },
      { property: "og:description", content: "Dataset-grounded answers about marks, attendance and study plans." },
    ],
  }),
  component: AssistantPage,
});

const SUGGESTIONS = [
  "What is my attendance?",
  "What are my marks?",
  "Which subject am I weak in?",
  "What should I study?",
  "When is my next assessment?",
  "Who are the top performers?",
  "How many students are at risk?",
];

type Msg = { role: "user" | "bot"; text: string };

function AssistantPage() {
  const session = useSession();
  const student = (session?.role === "student" ? getStudent(session.id) : undefined) ?? students[0]!;
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "bot",
      text: `Hi ${student.name}! I'm your LearnMetrics assistant. I can answer questions about your marks, attendance, weak skills, study plan and the cohort analytics.`,
    },
  ]);
  const [input, setInput] = useState("");

  const answer = (q: string): string => {
    const t = q.toLowerCase();
    const summary = academicSummary(student);
    const stats = cohortStats();

    if (t.includes("attendance"))
      return `Your attendance is ${student.attendance}%. ${
        student.attendance >= 75
          ? "That is above the 75% requirement — keep it up."
          : `You need to attend consistently: you are ${75 - student.attendance} points below the 75% requirement.`
      }`;
    if (t.includes("mark") || t.includes("score") || t.includes("internal"))
      return `In ${student.assignment} (${student.subject}) you scored ${student.score}/100 (${student.percentage}%). Across ${student.testCount} assessments your average is ${student.averageScore}%, and your mastery level for ${student.skill} is ${student.mastery}.`;
    if (t.includes("weak") || t.includes("improve"))
      return `Your weakest area is ${student.missedFacts}, and you got ${student.incorrect} of ${student.attempted} questions wrong in the last assessment. Focus practice there first.`;
    if (t.includes("study") || t.includes("plan"))
      return `Study plan: 3 sessions per week of 40 minutes on ${student.missedFacts}, one revision of ${student.skill} concepts, and one timed mock assessment. Target: ${Math.min(100, student.percentage + 8)}% next time (currently ${student.percentage}%).`;
    if (t.includes("exam") || t.includes("test") || t.includes("timetable") || t.includes("result"))
      return `Your most recent assessment was ${student.assignment} on ${student.date}, and your last recorded activity was ${student.lastActivity}. Check the Calendar page for the full colour-coded assessment schedule.`;
    if (t.includes("gpa") || t.includes("predict") || t.includes("risk"))
      return `Projected GPA is ${summary.gpa} with a ${summary.risk.toLowerCase()} risk profile. You currently rank #${summary.rank} of ${students.length} in the cohort.`;
    if (t.includes("top") || t.includes("best") || t.includes("rank"))
      return `Top performers: ${topPerformers(3).map((s) => `${s.name} (${s.percentage}%)`).join(", ")}. You are ranked #${summary.rank}.`;
    if (t.includes("at risk") || t.includes("attention") || t.includes("fail"))
      return `${stats.atRisk} of ${stats.total} students are flagged as needing attention. Lowest scores right now: ${lowestPerformers(3).map((s) => `${s.name} (${s.percentage}%)`).join(", ")}.`;
    if (t.includes("subject") || t.includes("class average") || t.includes("cohort"))
      return `Subject averages — ${bySubject().map((s) => `${s.subject}: ${s.averageScore}%`).join(", ")}. Cohort average is ${stats.averageScore}% with ${stats.averageAttendance}% attendance.`;
    if (t.includes("progress"))
      return `Course progress is ${student.progress}% with ${student.weeklyProgress}% weekly progress and ${student.practiceCompleted}% of practice completed.`;

    return `Here is your snapshot: ${summary.lines[0]} ${summary.lines[2]} Try asking about your marks, weak subjects, study plan, GPA prediction or the cohort analytics.`;
  };

  const send = (text: string) => {
    const q = text.trim();
    if (!q) return;
    setMessages((m) => [...m, { role: "user", text: q }, { role: "bot", text: answer(q) }]);
    setInput("");
  };

  return (
    <AppShell
      title="AI Academic Assistant"
      subtitle={`Grounded in ${students.length} learning records · answering as ${student.name} (${student.id})`}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <Card className="flex h-[70vh] flex-col">
          <CardContent className="flex-1 space-y-4 overflow-y-auto pt-6">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
                {m.role === "bot" ? (
                  <span className="gradient-primary flex size-8 shrink-0 items-center justify-center rounded-xl">
                    <Bot className="size-4 text-primary-foreground" />
                  </span>
                ) : null}
                <p
                  className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground"
                  }`}
                >
                  {m.text}
                </p>
                {m.role === "user" ? (
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-secondary">
                    <User className="size-4" />
                  </span>
                ) : null}
              </div>
            ))}
          </CardContent>
          <form
            className="flex gap-2 border-t p-4"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about marks, attendance, weak subjects…"
            />
            <Button type="submit" size="icon" aria-label="Send message">
              <Send className="size-4" />
            </Button>
          </form>
        </Card>

        <Card>
          <CardContent className="space-y-2 pt-6">
            <p className="flex items-center gap-2 text-sm font-medium">
              <Sparkles className="size-4 text-accent" /> Try asking
            </p>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="w-full rounded-xl border px-3 py-2 text-left text-xs transition-colors hover:bg-secondary"
              >
                {s}
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
