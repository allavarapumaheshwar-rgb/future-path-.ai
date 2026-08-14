import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { Sparkles, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

type AuthSearch = { mode?: "login" | "signup" | "forgot"; next?: string };

/** Only allow same-origin relative paths as a post-login redirect target. */
function safeNext(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  if (!value.startsWith("/") || value.startsWith("//")) return undefined;
  return value;
}

export const Route = createFileRoute("/auth")({
  validateSearch: (s: Record<string, unknown>): AuthSearch => ({
    mode: (s.mode === "signup" || s.mode === "forgot" ? s.mode : "login"),
    next: safeNext(s.next),
  }),
  head: () => ({ meta: [{ title: "Login & Signup — FuturePath AI" }] }),
  component: AuthPage,
});


const signupSchema = z.object({
  full_name: z.string().min(2, "Name is too short").max(80),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Min 6 characters").max(72),
  mobile: z.string().min(10, "Invalid mobile").max(15),
  grade: z.string().min(1, "Required"),
  stream: z.string().optional(),
  role: z.enum(["student", "parent", "teacher", "counselor"]),
  interests: z.string().optional(),
});

function AuthPage() {
  const { mode = "login", next } = useSearch({ from: "/auth" });
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const goAfterAuth = () => {
    if (next) window.location.href = next;
    else navigate({ to: "/dashboard" });
  };


  return (
    <Layout>
      <section className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-2">
        <div className="hidden lg:flex flex-col justify-between p-12 gradient-primary text-primary-foreground">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/15 backdrop-blur">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="font-display text-xl font-bold">FuturePath AI</span>
          </Link>
          <div className="space-y-4 max-w-md">
            <h1 className="font-display text-4xl font-bold leading-tight">
              Your future, mapped by AI.
            </h1>
            <p className="text-primary-foreground/90">
              Join thousands of students discovering streams, careers, scholarships and skills
              tailored to who they are — not just their marks.
            </p>
            <ul className="space-y-2 text-sm text-primary-foreground/85">
              <li>✓ Personal AI Career Mentor</li>
              <li>✓ Skill & scholarship tracker</li>
              <li>✓ Curated college wishlist</li>
              <li>✓ Free, forever</li>
            </ul>
          </div>
          <p className="text-xs text-primary-foreground/70">© {new Date().getFullYear()} FuturePath AI</p>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-12">
          <div className="w-full max-w-md">
            <div className="lg:hidden mb-6 flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl gradient-primary"><Sparkles className="h-5 w-5 text-primary-foreground" /></div>
              <span className="font-display text-lg font-bold">FuturePath <span className="gradient-text">AI</span></span>
            </div>

            <div className="flex gap-1 p-1 rounded-xl bg-muted mb-6">
              {(["login", "signup", "forgot"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => navigate({ to: "/auth", search: { mode: m } })}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition ${
                    mode === m ? "bg-card shadow-soft text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {m === "login" ? "Login" : m === "signup" ? "Sign Up" : "Reset"}
                </button>
              ))}
            </div>

            {mode === "login" && <LoginForm busy={busy} setBusy={setBusy} show={show} setShow={setShow} onSuccess={() => navigate({ to: "/dashboard" })} />}
            {mode === "signup" && <SignupForm busy={busy} setBusy={setBusy} show={show} setShow={setShow} onSuccess={() => navigate({ to: "/dashboard" })} />}
            {mode === "forgot" && <ForgotForm busy={busy} setBusy={setBusy} />}
          </div>
        </div>
      </section>
    </Layout>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}

const inputCls =
  "w-full px-3.5 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition";

function LoginForm({ busy, setBusy, show, setShow, onSuccess }: { busy: boolean; setBusy: (b: boolean) => void; show: boolean; setShow: (b: boolean) => void; onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back!");
    void remember;
    onSuccess();
  }

  async function google() {
    setBusy(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) {
      setBusy(false);
      toast.error(error.message);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <h2 className="font-display text-2xl font-bold">Welcome back</h2>
      <p className="text-sm text-muted-foreground">Sign in to access your personal career dashboard.</p>

      <Field label="Email">
        <input className={inputCls} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      </Field>
      <Field label="Password">
        <div className="relative">
          <input className={inputCls + " pr-10"} type={show ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          <button type="button" onClick={() => setShow(!show)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground" aria-label="Toggle password">
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </Field>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="rounded border-input" />
          <span>Remember me</span>
        </label>
        <Link to="/auth" search={{ mode: "forgot" }} className="text-primary hover:underline">Forgot password?</Link>
      </div>

      <button disabled={busy} className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg gradient-primary text-primary-foreground font-semibold shadow-soft hover-lift disabled:opacity-60">
        {busy && <Loader2 className="h-4 w-4 animate-spin" />} Sign in
      </button>

      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
        <div className="relative flex justify-center text-xs"><span className="bg-background px-2 text-muted-foreground">OR</span></div>
      </div>

      <button type="button" onClick={google} disabled={busy} className="w-full px-4 py-2.5 rounded-lg border border-input bg-card hover:bg-muted text-sm font-medium">
        Continue with Google
      </button>

      <p className="text-sm text-center text-muted-foreground">
        New here? <Link to="/auth" search={{ mode: "signup" }} className="text-primary font-medium hover:underline">Create an account</Link>
      </p>
    </form>
  );
}

function SignupForm({ busy, setBusy, show, setShow, onSuccess }: { busy: boolean; setBusy: (b: boolean) => void; show: boolean; setShow: (b: boolean) => void; onSuccess: () => void }) {
  const [data, setData] = useState({
    full_name: "", email: "", password: "", mobile: "", grade: "Class 10",
    stream: "", role: "student" as "student" | "parent" | "teacher" | "counselor",
    interests: "",
  });
  function up<K extends keyof typeof data>(k: K, v: typeof data[K]) { setData((d) => ({ ...d, [k]: v })); }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = signupSchema.safeParse(data);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
        data: {
          full_name: data.full_name,
          mobile: data.mobile,
          grade: data.grade,
          stream: data.stream || null,
          role: data.role,
          interests: data.interests ? data.interests.split(",").map((s) => s.trim()).filter(Boolean) : [],
        },
      },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Account created! Welcome to FuturePath AI.");
    onSuccess();
  }

  return (
    <form onSubmit={submit} className="space-y-3.5">
      <h2 className="font-display text-2xl font-bold">Create your account</h2>
      <p className="text-sm text-muted-foreground">Personalized career guidance in under a minute.</p>

      <Field label="Full name"><input className={inputCls} required value={data.full_name} onChange={(e) => up("full_name", e.target.value)} placeholder="Priya Sharma" /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Email"><input className={inputCls} type="email" required value={data.email} onChange={(e) => up("email", e.target.value)} /></Field>
        <Field label="Mobile"><input className={inputCls} required value={data.mobile} onChange={(e) => up("mobile", e.target.value)} placeholder="+91 …" /></Field>
      </div>
      <Field label="Password">
        <div className="relative">
          <input className={inputCls + " pr-10"} type={show ? "text" : "password"} required value={data.password} onChange={(e) => up("password", e.target.value)} placeholder="Min 6 characters" />
          <button type="button" onClick={() => setShow(!show)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground">
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Class / Grade">
          <select className={inputCls} value={data.grade} onChange={(e) => up("grade", e.target.value)}>
            {["Class 10", "Intermediate / Class 11", "Intermediate / Class 12", "Degree (UG)", "Graduate"].map((g) => <option key={g}>{g}</option>)}
          </select>
        </Field>
        <Field label="Current Stream">
          <select className={inputCls} value={data.stream} onChange={(e) => up("stream", e.target.value)}>
            <option value="">— Select —</option>
            {["MPC", "BiPC", "CEC", "MEC", "Arts/Humanities", "Other"].map((s) => <option key={s}>{s}</option>)}
          </select>
        </Field>
      </div>
      <Field label="I am a">
        <select className={inputCls} value={data.role} onChange={(e) => up("role", e.target.value as typeof data.role)}>
          <option value="student">Student</option>
          <option value="parent">Parent</option>
          <option value="teacher">Teacher</option>
          <option value="counselor">Career Counselor</option>
        </select>
      </Field>
      <Field label="Career interests (comma separated)">
        <input className={inputCls} value={data.interests} onChange={(e) => up("interests", e.target.value)} placeholder="AI, Medicine, Design" />
      </Field>

      <button disabled={busy} className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg gradient-primary text-primary-foreground font-semibold shadow-soft hover-lift disabled:opacity-60">
        {busy && <Loader2 className="h-4 w-4 animate-spin" />} Create account
      </button>
      <p className="text-sm text-center text-muted-foreground">
        Already a member? <Link to="/auth" search={{ mode: "login" }} className="text-primary font-medium hover:underline">Sign in</Link>
      </p>
    </form>
  );
}

function ForgotForm({ busy, setBusy }: { busy: boolean; setBusy: (b: boolean) => void }) {
  const [email, setEmail] = useState("");
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Reset link sent. Check your inbox.");
  }
  return (
    <form onSubmit={submit} className="space-y-4">
      <h2 className="font-display text-2xl font-bold">Reset password</h2>
      <p className="text-sm text-muted-foreground">We'll email you a secure link to set a new password.</p>
      <Field label="Email"><input className={inputCls} type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
      <button disabled={busy} className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg gradient-primary text-primary-foreground font-semibold disabled:opacity-60">
        {busy && <Loader2 className="h-4 w-4 animate-spin" />} Send reset link
      </button>
      <p className="text-sm text-center text-muted-foreground">
        <Link to="/auth" search={{ mode: "login" }} className="text-primary font-medium hover:underline">Back to login</Link>
      </p>
    </form>
  );
}
