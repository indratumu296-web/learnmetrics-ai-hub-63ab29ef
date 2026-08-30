import { createFileRoute } from "@tanstack/react-router";
import { CalendarPlus, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { AppShell } from "@/components/AppShell";
import { useSession } from "@/lib/session";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CalendarPage,
});

const BASE_MONTHS = ["2026-02", "2026-03", "2026-04", "2026-05", "2026-06", "2026-07"];
const HOLIDAYS = new Set(["2026-03-25", "2026-05-01", "2026-06-16", "2026-07-04"]);
const STORAGE_KEY = "learnmetrics.calendar.events";

type EventKind = "event" | "holiday" | "assessment";

type CalendarEvent = {
  id: string;
  date: string;
  title: string;
  kind: EventKind;
  notes?: string;
};

const SEED_EVENTS: CalendarEvent[] = [
  { id: "seed-1", date: "2026-02-20", title: "Campus event", kind: "event" },
  { id: "seed-2", date: "2026-04-18", title: "Campus event", kind: "event" },
  { id: "seed-3", date: "2026-06-05", title: "Campus event", kind: "event" },
];

function loadEvents(): CalendarEvent[] {
  if (typeof window === "undefined") return SEED_EVENTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED_EVENTS;
    const parsed = JSON.parse(raw) as CalendarEvent[];
    return Array.isArray(parsed) ? parsed : SEED_EVENTS;
  } catch {
    return SEED_EVENTS;
  }
}

function monthLabel(m: string) {
  return new Date(`${m}-01T00:00:00`).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function CalendarPage() {
  const session = useSession();
  const isAdmin = session?.role === "admin";

  const [events, setEvents] = useState<CalendarEvent[]>(SEED_EVENTS);
  const [hydrated, setHydrated] = useState(false);
  const [month, setMonth] = useState(BASE_MONTHS[2]!);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<{ date: string; title: string; kind: EventKind; notes: string }>({
    date: "",
    title: "",
    kind: "event",
    notes: "",
  });

  useEffect(() => {
    setEvents(loadEvents());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events, hydrated]);

  const months = useMemo(() => {
    const set = new Set(BASE_MONTHS);
    for (const e of events) set.add(e.date.slice(0, 7));
    return [...set].sort();
  }, [events]);

  const examDays = useMemo(() => {
    const map = new Map<string, number>();
    for (const s of students) map.set(s.date, (map.get(s.date) ?? 0) + 1);
    return map;
  }, []);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const e of events) map.set(e.date, [...(map.get(e.date) ?? []), e]);
    return map;
  }, [events]);

  const first = new Date(`${month}-01T00:00:00`);
  const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const offset = first.getDay();

  const monthEvents = useMemo(
    () => events.filter((e) => e.date.startsWith(month)).sort((a, b) => a.date.localeCompare(b.date)),
    [events, month],
  );

  const cellClass = (iso: string, weekday: number) => {
    const dayEvents = eventsByDate.get(iso) ?? [];
    if (HOLIDAYS.has(iso) || weekday === 0 || dayEvents.some((e) => e.kind === "holiday"))
      return "bg-destructive/15 text-destructive border-destructive/30";
    if (examDays.has(iso) || dayEvents.some((e) => e.kind === "assessment"))
      return "bg-primary/15 text-primary border-primary/30";
    if (dayEvents.length > 0) return "bg-warning/25 text-warning-foreground border-warning/40";
    return "bg-success/10 text-foreground border-success/20";
  };

  const addEvent = () => {
    if (!form.date || !form.title.trim()) {
      toast.error("Pick a date and enter a title.");
      return;
    }
    const next: CalendarEvent = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      date: form.date,
      title: form.title.trim(),
      kind: form.kind,
      ...(form.notes.trim() ? { notes: form.notes.trim() } : {}),
    };
    setEvents((prev) => [...prev, next]);
    setMonth(form.date.slice(0, 7));
    setForm({ date: "", title: "", kind: "event", notes: "" });
    setOpen(false);
    toast.success(`Added "${next.title}" on ${next.date}`);
  };

  const removeEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    toast.success("Event removed");
  };

  return (
    <AppShell title="Academic Calendar" subtitle="Working days, assessments, holidays and events">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {months.map((m) => (
          <button
            key={m}
            onClick={() => setMonth(m)}
            className={`rounded-xl border px-3 py-1.5 text-sm transition-colors ${
              m === month ? "bg-primary text-primary-foreground" : "bg-card hover:bg-secondary"
            }`}
          >
            {monthLabel(m)}
          </button>
        ))}

        {isAdmin && hydrated && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="ml-auto">
                <CalendarPlus className="size-4" />
                Add an event
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add an event</DialogTitle>
                <DialogDescription>
                  Events you add appear on the calendar and stay saved on this device.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="event-date">Date</Label>
                  <Input
                    id="event-date"
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="event-title">Title</Label>
                  <Input
                    id="event-title"
                    placeholder="Science exhibition"
                    value={form.title}
                    onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="event-kind">Type</Label>
                  <Select
                    value={form.kind}
                    onValueChange={(v) => setForm((f) => ({ ...f, kind: v as EventKind }))}
                  >
                    <SelectTrigger id="event-kind">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="event">Campus event</SelectItem>
                      <SelectItem value="assessment">Assessment</SelectItem>
                      <SelectItem value="holiday">Holiday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="event-notes">Notes (optional)</Label>
                  <Textarea
                    id="event-notes"
                    rows={3}
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={addEvent}>Save event</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center gap-3">
          <CardTitle className="text-base">{monthLabel(month)}</CardTitle>
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
              const dayEvents = eventsByDate.get(iso) ?? [];
              return (
                <div key={iso} className={`min-h-20 rounded-xl border p-2 text-left ${cellClass(iso, weekday)}`}>
                  <span className="text-sm font-semibold">{day}</span>
                  {count > 0 ? (
                    <p className="mt-1 text-[11px] leading-tight">{count} assessment{count > 1 ? "s" : ""}</p>
                  ) : null}
                  {HOLIDAYS.has(iso) ? <p className="mt-1 text-[11px]">Holiday</p> : null}
                  {dayEvents.map((e) => (
                    <p key={e.id} className="mt-1 text-[11px] leading-tight">{e.title}</p>
                  ))}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Events in {monthLabel(month)}</CardTitle>
        </CardHeader>
        <CardContent>
          {monthEvents.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {isAdmin && hydrated ? 'No events yet. Use “Add an event” to create one.' : 'No events scheduled this month.'}
            </p>
          ) : (
            <ul className="divide-y">
              {monthEvents.map((e) => (
                <li key={e.id} className="flex items-start gap-3 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">
                      {e.title}{" "}
                      <Badge variant="outline" className="ml-1 text-[10px] capitalize">{e.kind}</Badge>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(`${e.date}T00:00:00`).toLocaleDateString("en-US", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                      {e.notes ? ` — ${e.notes}` : ""}
                    </p>
                  </div>
                  {isAdmin && hydrated && (
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Delete ${e.title}`}
                      onClick={() => removeEvent(e.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </AppShell>
  );
}
