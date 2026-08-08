CREATE TABLE public.students (
  id text PRIMARY KEY,
  name text NOT NULL,
  grade text NOT NULL DEFAULT '',
  class_name text NOT NULL DEFAULT '',
  subject text NOT NULL DEFAULT '',
  skill text NOT NULL DEFAULT '',
  mastery text NOT NULL DEFAULT '',
  needs_attention boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.students TO anon, authenticated;
GRANT ALL ON public.students TO service_role;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
CREATE POLICY "students_public_read" ON public.students FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.marks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id text NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  assignment text NOT NULL DEFAULT '',
  subject text NOT NULL DEFAULT '',
  skill text NOT NULL DEFAULT '',
  assessed_on date,
  score numeric NOT NULL DEFAULT 0,
  percentage numeric NOT NULL DEFAULT 0,
  attempted integer NOT NULL DEFAULT 0,
  correct integer NOT NULL DEFAULT 0,
  incorrect integer NOT NULL DEFAULT 0,
  missed_facts text NOT NULL DEFAULT '',
  mastery text NOT NULL DEFAULT '',
  test_count integer NOT NULL DEFAULT 0,
  average_score numeric NOT NULL DEFAULT 0,
  progress numeric NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, assignment, assessed_on)
);
GRANT SELECT ON public.marks TO anon, authenticated;
GRANT ALL ON public.marks TO service_role;
ALTER TABLE public.marks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "marks_public_read" ON public.marks FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.attendance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id text NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  recorded_on date,
  attendance_percentage numeric NOT NULL DEFAULT 0,
  practice_completed integer NOT NULL DEFAULT 0,
  weekly_progress numeric NOT NULL DEFAULT 0,
  last_activity text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (student_id, recorded_on)
);
GRANT SELECT ON public.attendance TO anon, authenticated;
GRANT ALL ON public.attendance TO service_role;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "attendance_public_read" ON public.attendance FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.import_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name text NOT NULL DEFAULT '',
  rows_read integer NOT NULL DEFAULT 0,
  students_written integer NOT NULL DEFAULT 0,
  marks_written integer NOT NULL DEFAULT 0,
  attendance_written integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'success',
  error_message text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.import_runs TO anon, authenticated;
GRANT ALL ON public.import_runs TO service_role;
ALTER TABLE public.import_runs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "import_runs_public_read" ON public.import_runs FOR SELECT TO anon, authenticated USING (true);

CREATE INDEX marks_student_idx ON public.marks (student_id);
CREATE INDEX attendance_student_idx ON public.attendance (student_id);