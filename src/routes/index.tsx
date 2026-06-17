import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { streams, careers, successStories } from "@/lib/data";
import { ArrowRight, Sparkles, Compass, GraduationCap, Trophy, Lightbulb, Target, Users, Zap, BookOpen, Briefcase, Star } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FuturePath AI — Discover. Decide. Succeed." },
      { name: "description", content: "AI-powered career guidance for students from Class 10 to graduates." },
    ],
  }),
  component: Home,
});

const stats = [
  { value: "50+", label: "Careers Mapped", icon: Briefcase },
  { value: "5", label: "Major Streams", icon: BookOpen },
  { value: "100+", label: "Top Colleges", icon: GraduationCap },
  { value: "1M+", label: "Students Guided", icon: Users },
];

const features = [
  { icon: Compass, title: "Stream Explorer", desc: "Deep-dive into MPC, BiPC, CEC, MEC and Arts with full roadmaps.", to: "/streams" },
  { icon: Briefcase, title: "Career Encyclopedia", desc: "20+ detailed careers with skills, salary and growth paths.", to: "/careers" },
  { icon: Target, title: "AI Career Quiz", desc: "Personalized stream + career recommendations in 2 minutes.", to: "/quiz" },
  { icon: GraduationCap, title: "College Finder", desc: "Top engineering, medical, commerce, law and arts colleges.", to: "/colleges" },
  { icon: Trophy, title: "Scholarships", desc: "Find funding opportunities by level and eligibility.", to: "/scholarships" },
  { icon: Lightbulb, title: "Skills Hub", desc: "Build communication, coding, leadership and financial literacy.", to: "/skills" },
];

function Home() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 gradient-hero opacity-95" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,oklch(1_0_0/0.15),transparent_50%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-20 lg:py-28 text-primary-foreground">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur border border-white/20 text-xs font-medium mb-6">
                <Sparkles className="h-3.5 w-3.5" /> India's #1 AI Career Guidance Platform
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] mb-5">
                Discover. Decide. <span className="block">Succeed.</span>
              </h1>
              <p className="text-lg text-white/85 max-w-xl mb-8">
                From Class 10 to graduation — explore streams, careers, colleges and scholarships. Let AI guide you to the future you deserve.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/careers" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-primary font-semibold shadow-lg hover-lift">
                  Explore Careers <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/quiz" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-white/40 backdrop-blur bg-white/10 text-white font-semibold hover:bg-white/20 transition-colors">
                  <Zap className="h-4 w-4" /> Take Career Quiz
                </Link>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-10">
                {stats.map((s) => (
                  <div key={s.label} className="rounded-xl bg-white/10 backdrop-blur border border-white/15 p-3">
                    <s.icon className="h-5 w-5 mb-1 opacity-80" />
                    <div className="font-display text-2xl font-bold">{s.value}</div>
                    <div className="text-xs text-white/75">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative animate-float">
                <div className="absolute -inset-8 bg-white/10 rounded-3xl blur-3xl" />
                <div className="relative grid grid-cols-2 gap-4">
                  {streams.slice(0, 4).map((s, i) => (
                    <div key={s.slug} className={`rounded-2xl bg-white/95 text-foreground p-5 shadow-elegant ${i % 2 ? "translate-y-6" : ""}`}>
                      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${s.gradient} text-white font-bold mb-3`}>{s.code}</div>
                      <div className="font-semibold text-sm">{s.name.split(",")[0]}</div>
                      <div className="text-xs text-muted-foreground mt-1 line-clamp-2">{s.tagline}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">Everything you need</div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">Your complete career ecosystem</h2>
          <p className="text-muted-foreground">From stream selection to dream job — guidance at every step.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <Link key={f.title} to={f.to} className="group relative rounded-2xl border border-border bg-card p-6 hover-lift overflow-hidden">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full gradient-primary opacity-0 group-hover:opacity-10 transition-opacity blur-2xl" />
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl gradient-primary text-primary-foreground mb-4 shadow-soft">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-1.5">{f.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">{f.desc}</p>
              <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                Explore <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Streams */}
      <section className="bg-card/50 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <div className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">Stream Explorer</div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold">Pick your stream, plan your future</h2>
            </div>
            <Link to="/streams" className="text-sm font-semibold text-primary inline-flex items-center gap-1">View all <ArrowRight className="h-4 w-4" /></Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {streams.map((s) => (
              <Link key={s.slug} to="/streams/$slug" params={{ slug: s.slug }} className="group rounded-2xl bg-background border border-border p-5 hover-lift">
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${s.gradient} text-white font-bold mb-3 shadow-soft`}>{s.code}</div>
                <h3 className="font-display font-semibold mb-1 group-hover:text-primary transition-colors">{s.name.split(",")[0]}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2">{s.tagline}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular careers */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <div className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">Trending</div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">Most explored careers</h2>
          </div>
          <Link to="/careers" className="text-sm font-semibold text-primary inline-flex items-center gap-1">All careers <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {careers.slice(0, 8).map((c) => (
            <Link key={c.slug} to="/careers/$slug" params={{ slug: c.slug }} className="group rounded-2xl border border-border bg-card p-5 hover-lift">
              <div className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">{c.category}</div>
              <h3 className="font-display font-semibold mb-2 group-hover:text-primary transition-colors">{c.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{c.overview}</p>
              <div className="text-xs font-medium text-foreground/80">{c.salary}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Success */}
      <section className="bg-card/50 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">Real students. Real wins.</div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold">Success stories</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {successStories.slice(0, 3).map((s) => (
              <div key={s.name} className="rounded-2xl bg-background border border-border p-6 hover-lift">
                <div className="flex items-center gap-1 mb-3">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />)}</div>
                <p className="text-sm text-foreground/80 mb-4">"{s.story}"</p>
                <div className="border-t border-border pt-4">
                  <div className="font-semibold text-sm">{s.name}</div>
                  <div className="text-xs text-primary">{s.role}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{s.stream}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl gradient-hero p-10 sm:p-16 text-center text-primary-foreground">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,oklch(1_0_0/0.2),transparent_50%)]" />
          <div className="relative">
            <h2 className="font-display text-3xl sm:text-5xl font-bold mb-4">Not sure where to start?</h2>
            <p className="text-lg text-white/85 mb-8 max-w-xl mx-auto">Take our 2-minute AI career quiz and get personalized stream + career recommendations.</p>
            <Link to="/quiz" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-primary font-semibold shadow-lg hover-lift">
              Start the Quiz <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
