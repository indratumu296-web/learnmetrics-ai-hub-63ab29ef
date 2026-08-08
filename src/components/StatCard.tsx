import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const tones = {
  default: "bg-secondary text-primary",
  accent: "bg-accent/15 text-accent",
  success: "bg-success/15 text-success",
  danger: "bg-destructive/15 text-destructive",
  warning: "bg-warning/20 text-warning",
} as const;

export function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone = "default",
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
  tone?: keyof typeof tones;
}) {
  return (
    <Card className="shadow-soft transition-transform hover:-translate-y-0.5">
      <CardContent className="flex items-start gap-4 pt-6">
        <span className={cn("flex size-11 shrink-0 items-center justify-center rounded-2xl", tones[tone])}>
          <Icon className="size-5" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
          {hint ? <p className="mt-1 truncate text-xs text-muted-foreground">{hint}</p> : null}
        </div>
      </CardContent>
    </Card>
  );
}
