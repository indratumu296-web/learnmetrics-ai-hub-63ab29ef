import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { AppShell } from "@/components/AppShell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { students } from "@/lib/learnmetrics";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Academic Calendar — LearnMetrics" },
      {
        name: "description",
        content: "Colour-coded academic calendar of assessment days, holidays, events and working days built from assessment dates.",
      },
      { property: "og:title", content: "Academic Calendar — LearnMetrics" },
      { property: "og:description", content: "Assessments, holidays and events at a glance." },
    ],
  }),
  component: CalendarPage,
});

const MONTHS = ["2026-02", "2026-03", "2026-04", "2026-05", "2026-06", "2026-07"];
const HOLIDAYS = new Set(["2026-03-25", "2026-05-01", "2026-06-16", "2026-07-04"]);
const EVENTS = new Set(["2026-02-20", "2026-04-18", "2026-06-05"]);

function CalendarPage() {
  const [month, setMonth] = useState(MONTHS[2]!);

  const examDays = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of students) map.set(s.date, (map.get(s.date) ?? 0) + 1);
    return map;
  }, []);

  const first = new Date(`${month}-01T00:00:00`);
  const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const offset = first.getDay();

  const cellClass = (iso: string, weekday: number) => {
    if (HOLIDAYS.has(iso) || weekday === 0) return "bg-destructive/15 text-destructive border-destructive/30";
    if (examDays.has(iso)) return "bg-primary/15 text-primary border-primary/30";
    if (EVENTS.has(iso)) return "bg-warning/25 text-warning-foreground border-warning/40";
    return "bg-success/10 text-foreground border-success/20";
  };

  return (
    <AppShell title="Academic Calendar" subtitle="Working days, assessments, holidays and events">
      <div className="mb-4 flex flex-wrap gap-2">
        {MONTHS.map((m) => (
          <button
            key={m}
            onClick={() => setMonth(m)}
            className={`rounded-xl border px-3 py-1.5 text-sm transition-colors ${
              m === month ? "bg-primary text-primary-foreground" : "bg-card hover:bg-secondary"
            }`}
          >
            {new Date(`${m}-01`).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </button>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center gap-3">
          <CardTitle className="text-base">
            {new Date(`${month}-01`).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
          </CardTitle>
          <div className="flex flex-wrap gap-2 text-xs">
            <Badge variant="outline" className="border-success/40">Working day</Badge>
            <Badge variant="outline" className="border-destructive/40">Holiday</Badge>
            <Badge variant="outline" className="border-primary/40">Assessment</Badge>
            <Badge variant="outline" className="border-warning/50">Event</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 text-center text-xs font-medium text-muted-foreground">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <div className="mt-2 grid grid-cols-7 gap-2">
            {Array.from({ length: offset }).map((_, i) => (
              <div key={`pad-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const iso = `${month}-${String(day).padStart(2, "0")}`;
              const weekday = new Date(`${iso}T00:00:00`).getDay();
              const count = examDays.get(iso) ?? 0;
              return (
                <div key={iso} className={`min-h-20 rounded-xl border p-2 text-left ${cellClass(iso, weekday)}`}>
                  <span className="text-sm font-semibold">{day}</span>
                  {count > 0 ? (
                    <p className="mt-1 text-[11px] leading-tight">{count} assessment{count > 1 ? "s" : ""}</p>
                  ) : null}
                  {HOLIDAYS.has(iso) ? <p className="mt-1 text-[11px]">Holiday</p> : null}
                  {EVENTS.has(iso) ? <p className="mt-1 text-[11px]">Campus event</p> : null}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </AppShell>
  );
}
