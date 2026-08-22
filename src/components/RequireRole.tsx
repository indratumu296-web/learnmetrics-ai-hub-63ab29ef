import { Link } from "@tanstack/react-router";
import { Lock, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useSession } from "@/lib/session";

export function RequireRole({
  role,
  children,
}: {
  role: "admin" | "student";
  children: ReactNode;
}) {
  const session = useSession();

  if (session?.role === role) return <>{children}</>;

  const isAdminArea = role === "admin";

  return (
    <Card className="mx-auto mt-6 max-w-lg text-center">
      <CardHeader>
        <span className="gradient-primary mx-auto flex size-12 items-center justify-center rounded-2xl">
          <Lock className="size-6 text-primary-foreground" />
        </span>
        <CardTitle className="mt-3 text-xl">
          {isAdminArea ? "Admin access required" : "Student access required"}
        </CardTitle>
        <CardDescription>
          {session
            ? `You are signed in as ${session.name} (${session.role}). This area is limited to ${role} accounts.`
            : `Sign in with a ${role} account to view this page.`}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-3">
        <Button asChild>
          <Link to="/login">
            <ShieldCheck className="size-4" />
            Sign in as {role}
          </Link>
        </Button>
        {session?.role === "student" ? (
          <Button asChild variant="outline">
            <Link to="/student">Back to my dashboard</Link>
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}
