import { createFileRoute, useRouter } from "@tanstack/react-router";
import { GraduationCap, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getStudent } from "@/lib/learnmetrics";
import { signIn } from "@/lib/session";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — LearnMetrics Portal" },
      {
        name: "description",
        content: "Secure role-based sign in for students and administrators of the LearnMetrics analytics portal.",
      },
      { property: "og:title", content: "Sign in — LearnMetrics Portal" },
      { property: "og:description", content: "Role-based access for students, faculty and admins." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const router = useRouter();
  const [studentId, setStudentId] = useState("S0001");
  const [studentPassword, setStudentPassword] = useState("student123");
  const [adminUser, setAdminUser] = useState("admin");
  const [adminPassword, setAdminPassword] = useState("admin123");

  const studentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const student = getStudent(studentId.trim());
    if (!student || studentPassword !== "student123") {
      toast.error("Invalid student ID or password");
      return;
    }
    signIn({ role: "student", id: student.id, name: student.name });
    toast.success(`Welcome back, ${student.name}`);
    router.navigate({ to: "/student" });
  };

  const adminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUser.trim() !== "admin" || adminPassword !== "admin123") {
      toast.error("Invalid admin credentials");
      return;
    }
    signIn({ role: "admin", id: "admin", name: "Administrator" });
    toast.success("Signed in as administrator");
    router.navigate({ to: "/admin" });
  };

  return (
    <div className="gradient-hero flex min-h-screen items-center justify-center px-4 py-12">
      <Card className="glass-panel w-full max-w-md">
        <CardHeader className="text-center">
          <span className="gradient-primary mx-auto flex size-12 items-center justify-center rounded-2xl">
            <GraduationCap className="size-6 text-primary-foreground" />
          </span>
          <CardTitle className="mt-3 text-2xl">LearnMetrics Portal</CardTitle>
          <CardDescription>Measure Learning. Predict Success.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="student">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="student">Student</TabsTrigger>
              <TabsTrigger value="admin">Admin / Faculty</TabsTrigger>
            </TabsList>

            <TabsContent value="student">
              <form onSubmit={studentLogin} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="sid">Student ID</Label>
                  <Input id="sid" value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="S0001" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="spwd">Password</Label>
                  <Input id="spwd" type="password" value={studentPassword} onChange={(e) => setStudentPassword(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full">Sign in as student</Button>
                <p className="text-center text-xs text-muted-foreground">
                  Demo: any ID from S0001–S0120 · password <strong>student123</strong>
                </p>
              </form>
            </TabsContent>

            <TabsContent value="admin">
              <form onSubmit={adminLogin} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="au">Username</Label>
                  <Input id="au" value={adminUser} onChange={(e) => setAdminUser(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ap">Password</Label>
                  <Input id="ap" type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} required />
                </div>
                <Button type="submit" className="w-full">
                  <ShieldCheck className="size-4" /> Sign in as admin
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  Demo: <strong>admin</strong> / <strong>admin123</strong>
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
