import { Link, useRouter } from "@tanstack/react-router";
import {
  BarChart3,
  Bot,
  CalendarDays,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Moon,
  Sun,
  UploadCloud,
  Users,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { initTheme, signOut, toggleTheme, useSession } from "@/lib/session";

const nav = [
  { to: "/student", label: "Student Dashboard", icon: LayoutDashboard },
  { to: "/admin", label: "Admin Dashboard", icon: Users },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/assistant", label: "AI Assistant", icon: Bot },
  { to: "/admin/import", label: "CSV Import", icon: UploadCloud },
] as const;

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const session = useSession();
  const router = useRouter();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    initTheme();
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col bg-sidebar px-4 py-6 text-sidebar-foreground lg:flex">
        <Link to="/" className="mb-8 flex items-center gap-2 px-2">
          <span className="gradient-primary flex size-9 items-center justify-center rounded-xl">
            <GraduationCap className="size-5 text-sidebar-primary-foreground" />
          </span>
          <span className="text-lg font-semibold tracking-tight">LearnMetrics</span>
        </Link>

        <nav className="flex flex-col gap-1">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl bg-sidebar-accent p-4 text-xs text-sidebar-accent-foreground/80">
          <p className="font-semibold text-sidebar-accent-foreground">Dataset connected</p>
          <p className="mt-1">120 student learning records powering every chart.</p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="glass-panel sticky top-0 z-30 flex flex-wrap items-center gap-3 border-x-0 border-t-0 px-4 py-4 md:px-8">
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-xl font-semibold tracking-tight md:text-2xl">{title}</h1>
            {subtitle ? (
              <p className="truncate text-sm text-muted-foreground">{subtitle}</p>
            ) : null}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              aria-label="Toggle dark mode"
              onClick={() => {
                toggleTheme();
                setDark(document.documentElement.classList.contains("dark"));
              }}
            >
              {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </Button>
            {session ? (
              <Button
                variant="outline"
                onClick={() => {
                  signOut();
                  router.navigate({ to: "/login" });
                }}
              >
                <LogOut className="size-4" />
                <span className="hidden sm:inline">{session.name}</span>
              </Button>
            ) : (
              <Button asChild>
                <Link to="/login">Sign in</Link>
              </Button>
            )}
          </div>
        </header>

        <nav className="flex gap-1 overflow-x-auto border-b bg-card px-4 py-2 lg:hidden">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground"
              activeProps={{ className: "bg-secondary text-secondary-foreground" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <main className="flex-1 px-4 py-6 md:px-8">{children}</main>

        <footer className="border-t px-4 py-6 text-xs text-muted-foreground md:px-8">
          LearnMetrics — Measure Learning. Predict Success.
        </footer>
      </div>
    </div>
  );
}
