import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { getSkillBySlug, skillDetails } from "@/lib/skills-detail";
import * as Icons from "lucide-react";
import {
  ArrowLeft,
  BadgeCheck,
  Clock,
  ExternalLink,
  ListChecks,
  Repeat,
  Sparkles,
  Target,
} from "lucide-react";

export const Route = createFileRoute("/skills/$slug")({
  loader: ({ params }) => {
    const skill = getSkillBySlug(params.slug);
    if (!skill) throw notFound();
    return { skill };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `How to Learn ${loaderData.skill.name} — FuturePath AI` },
          { name: "description", content: loaderData.skill.overview.slice(0, 155) },
          { property: "og:title", content: `How to Learn ${loaderData.skill.name}` },
          { property: "og:description", content: loaderData.skill.overview.slice(0, 155) },
          { property: "og:type", content: "article" },
          { name: "twitter:card", content: "summary_large_image" },
        ]
      : [],
  }),
  component: SkillDetailPage,
  notFoundComponent: () => (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-3xl font-bold">Skill not found</h1>
        <Link to="/skills" className="mt-6 inline-block text-primary">
          Back to Skills Hub
        </Link>
      </div>
    </Layout>
  ),
});

function SkillDetailPage() {
  const { skill } = Route.useLoaderData();
  const Icon = (Icons as any)[skill.icon] ?? Icons.Sparkles;
  const others = skillDetails.filter((s) => s.slug !== skill.slug).slice(0, 4);

  return (
    <Layout>
      <section className="relative gradient-hero text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,oklch(1_0_0/0.2),transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
          <Link to="/skills" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white mb-6">
            <ArrowLeft className="h-4 w-4" /> All skills
          </Link>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="grid h-14 w-14 sm:h-16 sm:w-16 place-items-center rounded-2xl bg-white/15 backdrop-blur border border-white/20">
              <Icon className="h-7 w-7 sm:h-8 sm:w-8" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-white/15 backdrop-blur">
              {skill.level}
            </span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold mb-3">{skill.name}</h1>
          <p className="text-base sm:text-lg text-white/85 max-w-2xl">{skill.overview}</p>
          <div className="mt-5 inline-flex items-center gap-2 text-sm bg-white/15 backdrop-blur rounded-full px-4 py-2">
            <Clock className="h-4 w-4" /> {skill.timeToLearn}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-12 grid lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="grid h-9 w-9 place-items-center rounded-lg gradient-primary text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </div>
              <h2 className="font-display font-semibold">Why this skill matters</h2>
            </div>
            <p className="text-sm text-foreground/80">{skill.whyItMatters}</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="grid h-9 w-9 place-items-center rounded-lg gradient-primary text-primary-foreground">
                <ListChecks className="h-4 w-4" />
              </div>
              <h2 className="font-display font-semibold">How to learn it — step by step</h2>
            </div>
            <ol className="space-y-4">
              {skill.steps.map((step, i) => (
                <li key={step.title} className="flex gap-3.5">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-sm mb-0.5">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="grid h-9 w-9 place-items-center rounded-lg gradient-primary text-primary-foreground">
                <Repeat className="h-4 w-4" />
              </div>
              <h2 className="font-display font-semibold">Daily & weekly practice</h2>
            </div>
            <ul className="space-y-2.5">
              {skill.practice.map((p) => (
                <li key={p} className="flex gap-2.5 text-sm text-foreground/80">
                  <Icons.CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="grid h-9 w-9 place-items-center rounded-lg gradient-primary text-primary-foreground">
                <BadgeCheck className="h-4 w-4" />
              </div>
              <h2 className="font-display font-semibold">Where to learn — verified platforms</h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Government-verified sources are marked. All links open the official website.
            </p>
            <div className="grid gap-3">
              {skill.resources.map((r) => (
                <a
                  key={r.url + r.name}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-xl border border-border bg-background p-4 hover-lift block"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">{r.name}</h3>
                        {r.official && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            <BadgeCheck className="h-3 w-3" /> Govt. verified
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-primary font-medium mb-1">{r.provider}</div>
                      <p className="text-sm text-muted-foreground">{r.note}</p>
                    </div>
                    <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <div className="flex items-center gap-2.5 mb-3">
              <Target className="h-5 w-5 text-primary" />
              <h2 className="font-display font-semibold">Careers that need it</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {skill.careers.map((c) => (
                <span key={c} className="text-sm px-3 py-1 rounded-full bg-accent text-accent-foreground font-medium">
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
            <h2 className="font-display font-semibold mb-3">Learn next</h2>
            <div className="space-y-2">
              {others.map((s) => (
                <Link
                  key={s.slug}
                  to="/skills/$slug"
                  params={{ slug: s.slug }}
                  className="flex items-center justify-between gap-2 rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-medium hover:border-primary/40 hover:text-primary transition-colors"
                >
                  {s.name}
                  <Icons.ArrowRight className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Not sure which skill fits your career? Ask the AI Mentor.
            </p>
            <Link
              to="/mentor"
              className="inline-block w-full px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground font-semibold hover-lift"
            >
              Ask FuturePath AI Mentor
            </Link>
          </div>
        </aside>
      </section>
    </Layout>
  );
}
