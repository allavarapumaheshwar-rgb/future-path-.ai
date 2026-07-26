import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { supabase } from "@/integrations/supabase/client";
import {
  BookOpen, Briefcase, GraduationCap, Award, Bell, Target,
  TrendingUp, Sparkles, LogOut, Heart, Trophy, BarChart3, MessageCircle,
} from "lucide-react";
import { toast } from "sonner";
import { streams, careers, scholarships, skillsList } from "@/lib/data";

interface Profile {
  full_name: string | null; email: string | null; mobile: string | null;
  grade: string | null; stream: string | null; interests: string[] | null;
}

const DEFAULT_SKILLS = ["Communication", "Leadership", "Coding", "Public Speaking", "Critical Thinking"];

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — FuturePath AI" }] }),
  component: Dashboard,
});

function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [savedCareers, setSavedCareers] = useState<string[]>([]);
  const [savedColleges, setSavedColleges] = useState<{ name: string; slug: string | null }[]>([]);
  const [savedScholarships, setSavedScholarships] = useState<{ name: string; slug: string | null; deadline: string | null }[]>([]);
  const [skillProgress, setSkillProgress] = useState<Record<string, number>>({});
  const [notifs, setNotifs] = useState<{ id: string; title: string; body: string | null; category: string; read: boolean; created_at: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      const [p, sc, scol, sch, sp, n] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
        supabase.from("saved_careers").select("career_slug").eq("user_id", user.id),
        supabase.from("saved_colleges").select("college_name,college_slug").eq("user_id", user.id),
        supabase.from("saved_scholarships").select("scholarship_name,scholarship_slug,deadline").eq("user_id", user.id),
        supabase.from("skill_progress").select("skill_name,progress").eq("user_id", user.id),
        supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(8),
      ]);
      setProfile(p.data as Profile);
      setSavedCareers((sc.data ?? []).map((r) => r.career_slug));
      setSavedColleges((scol.data ?? []).map((r) => r.college_name));
      setSavedScholarships((sch.data ?? []).map((r) => ({ name: r.scholarship_name, deadline: r.deadline })));
      const sm: Record<string, number> = {};
      (sp.data ?? []).forEach((r) => { sm[r.skill_name] = r.progress; });
      DEFAULT_SKILLS.forEach((s) => { if (sm[s] === undefined) sm[s] = 0; });
      setSkillProgress(sm);
      setNotifs(n.data ?? []);
      setLoading(false);
    })();
  }, []);

  async function setSkill(name: string, value: number) {
    setSkillProgress((m) => ({ ...m, [name]: value }));
    await supabase.from("skill_progress").upsert(
      { user_id: userId, skill_name: name, progress: value, updated_at: new Date().toISOString() },
      { onConflict: "user_id,skill_name" },
    );
  }

  async function signOut() {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate({ to: "/" });
  }

  const recommendedStream = profile?.stream
    ? streams.find((s) => s.code.toLowerCase() === profile.stream?.toLowerCase())
    : streams[0];
  const recommendedCareers = recommendedStream
    ? careers.filter((c) => recommendedStream.careers.some((rc) => c.title.toLowerCase().includes(rc.toLowerCase().split(" ")[0]))).slice(0, 6)
    : careers.slice(0, 6);
  const avgSkill = Math.round(
    Object.values(skillProgress).reduce((a, b) => a + b, 0) / Math.max(Object.keys(skillProgress).length, 1),
  );

  if (loading) {
    return <Layout><div className="grid place-items-center h-[60vh] text-muted-foreground">Loading your dashboard…</div></Layout>;
  }

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-8">
        {/* Welcome */}
        <div className="rounded-3xl gradient-primary text-primary-foreground p-6 sm:p-8 shadow-glow flex flex-col md:flex-row md:items-center gap-6">
          <div className="grid h-20 w-20 place-items-center rounded-2xl bg-white/15 backdrop-blur text-2xl font-bold">
            {(profile?.full_name?.[0] ?? "S").toUpperCase()}
          </div>
          <div className="flex-1">
            <p className="text-sm text-primary-foreground/80">Welcome back,</p>
            <h1 className="font-display text-2xl sm:text-3xl font-bold">{profile?.full_name || "Student"} 👋</h1>
            <p className="text-sm text-primary-foreground/85 mt-1">
              {profile?.grade ?? "Class 10"} · {profile?.stream || "Stream not set"} · Career profile {avgSkill}% complete
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/mentor" className="px-4 py-2 rounded-lg bg-white text-primary text-sm font-semibold hover-lift inline-flex items-center gap-2">
              <MessageCircle className="h-4 w-4" /> Ask AI Mentor
            </Link>
            <button onClick={signOut} className="px-3 py-2 rounded-lg bg-white/15 hover:bg-white/25 text-sm font-medium inline-flex items-center gap-1.5">
              <LogOut className="h-4 w-4" /> Sign out
            </button>
          </div>
        </div>

        {/* Stat widgets */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Stat icon={Heart} label="Saved Careers" value={savedCareers.length} hint="Build your shortlist" />
          <Stat icon={GraduationCap} label="College Wishlist" value={savedColleges.length} />
          <Stat icon={Award} label="Scholarships" value={savedScholarships.length} hint="Tracked" />
          <Stat icon={TrendingUp} label="Skill Avg." value={`${avgSkill}%`} />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Career Profile + Roadmap */}
          <div className="lg:col-span-2 space-y-6">
            <Card icon={Target} title="Your Career Profile">
              <div className="grid sm:grid-cols-2 gap-3 text-sm">
                <Info label="Selected Stream" value={profile?.stream || "Not set"} />
                <Info label="Class" value={profile?.grade || "—"} />
                <Info label="Mobile" value={profile?.mobile || "—"} />
                <Info label="Email" value={profile?.email || "—"} />
              </div>
              {profile?.interests?.length ? (
                <div className="mt-4">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Interests</p>
                  <div className="flex flex-wrap gap-2">
                    {profile.interests.map((i) => (
                      <span key={i} className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">{i}</span>
                    ))}
                  </div>
                </div>
              ) : null}
            </Card>

            <Card icon={Briefcase} title="Recommended Careers">
              <div className="grid sm:grid-cols-2 gap-3">
                {recommendedCareers.map((c) => {
                  const saved = savedCareers.includes(c.slug);
                  return (
                    <div key={c.slug} className="p-4 rounded-xl border border-border hover:border-primary/40 transition group">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link to="/careers/$slug" params={{ slug: c.slug }} className="font-semibold hover:text-primary">{c.title}</Link>
                          <p className="text-xs text-muted-foreground mt-0.5">{c.salary}</p>
                        </div>
                        <button
                          onClick={async () => {
                            if (saved) {
                              await supabase.from("saved_careers").delete().eq("user_id", userId).eq("career_slug", c.slug);
                              setSavedCareers((s) => s.filter((x) => x !== c.slug));
                            } else {
                              await supabase.from("saved_careers").insert({ user_id: userId, career_slug: c.slug });
                              setSavedCareers((s) => [...s, c.slug]);
                            }
                          }}
                          aria-label="Toggle save"
                          className={`p-1.5 rounded-lg ${saved ? "text-rose-500 bg-rose-50" : "text-muted-foreground hover:text-rose-500 hover:bg-rose-50"}`}
                        >
                          <Heart className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            <Card icon={BookOpen} title={`${recommendedStream?.name ?? ""} Roadmap`}>
              <ol className="relative border-l-2 border-primary/20 ml-2 space-y-4">
                {[
                  `Build a strong foundation in ${recommendedStream?.subjects.slice(0, 3).join(", ")}`,
                  `Develop core skills: ${recommendedStream?.skills.slice(0, 3).join(", ")}`,
                  `Explore courses: ${recommendedStream?.courses.slice(0, 3).join(", ")}`,
                  `Target higher education: ${recommendedStream?.higherEducation.slice(0, 2).join(", ")}`,
                  `Career launch: ${recommendedStream?.careers.slice(0, 3).join(", ")}`,
                ].map((step, i) => (
                  <li key={i} className="ml-4">
                    <div className="absolute -left-2 grid h-4 w-4 place-items-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold">{i + 1}</div>
                    <p className="text-sm">{step}</p>
                  </li>
                ))}
              </ol>
            </Card>

            <Card icon={BarChart3} title="Skill Progress Tracker">
              <div className="space-y-4">
                {DEFAULT_SKILLS.map((s) => (
                  <div key={s}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="font-medium">{s}</span>
                      <span className="text-muted-foreground">{skillProgress[s] ?? 0}%</span>
                    </div>
                    <input
                      type="range" min={0} max={100} step={5} value={skillProgress[s] ?? 0}
                      onChange={(e) => setSkill(s, Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <Card icon={Bell} title="Notifications">
              {notifs.length === 0 ? (
                <p className="text-sm text-muted-foreground">You're all caught up.</p>
              ) : (
                <ul className="space-y-3">
                  {notifs.map((n) => (
                    <li key={n.id} className="text-sm border-l-2 border-primary pl-3">
                      <p className="font-medium">{n.title}</p>
                      {n.body && <p className="text-muted-foreground text-xs mt-0.5">{n.body}</p>}
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">{n.category}</p>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card icon={Award} title="Scholarship Tracker">
              {savedScholarships.length === 0 ? (
                <div>
                  <p className="text-sm text-muted-foreground mb-3">No scholarships tracked yet.</p>
                  <Link to="/scholarships" className="text-sm text-primary font-medium hover:underline">Browse scholarships →</Link>
                </div>
              ) : (
                <ul className="space-y-2 text-sm">
                  {savedScholarships.map((s) => (
                    <li key={s.name} className="flex justify-between gap-2 p-2 rounded-lg bg-muted/40">
                      <span className="font-medium">{s.name}</span>
                      {s.deadline && <span className="text-xs text-muted-foreground">{s.deadline}</span>}
                    </li>
                  ))}
                </ul>
              )}
              <p className="text-xs text-muted-foreground mt-3">{scholarships.length}+ scholarships in our database.</p>
            </Card>

            <Card icon={GraduationCap} title="College Wishlist">
              {savedColleges.length === 0 ? (
                <Link to="/colleges" className="text-sm text-primary font-medium hover:underline">Find colleges →</Link>
              ) : (
                <ul className="space-y-1 text-sm">
                  {savedColleges.map((c) => <li key={c} className="px-2 py-1 rounded bg-muted/40">{c}</li>)}
                </ul>
              )}
            </Card>

            <Card icon={Trophy} title="Quiz Results">
              <p className="text-sm text-muted-foreground mb-3">Take the AI career quiz to get a stream + career match.</p>
              <Link to="/quiz" className="inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline">
                <Sparkles className="h-4 w-4" /> Take quiz now
              </Link>
            </Card>

            <Card icon={BookOpen} title="Learning Recommendations">
              <ul className="space-y-2 text-sm">
                {skillsList.slice(0, 5).map((s) => (
                  <li key={s.name} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>{s.name} <span className="text-muted-foreground text-xs">— {s.level}</span></span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function Stat({ icon: Icon, label, value, hint }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string | number; hint?: string }) {
  return (
    <div className="p-5 rounded-2xl border border-border bg-card shadow-soft">
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="h-4 w-4" /></div>
      </div>
      <p className="font-display text-3xl font-bold mt-2">{value}</p>
      {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
    </div>
  );
}

function Card({ icon: Icon, title, children }: { icon: React.ComponentType<{ className?: string }>; title: string; children: React.ReactNode }) {
  return (
    <div className="p-5 sm:p-6 rounded-2xl border border-border bg-card shadow-soft">
      <div className="flex items-center gap-2 mb-4">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="h-4 w-4" /></div>
        <h3 className="font-display text-lg font-bold">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg bg-muted/40">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="font-medium mt-0.5">{value}</p>
    </div>
  );
}
