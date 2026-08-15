import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { skillsList } from "@/lib/data";
import { skillDetails, skillSlugFromName } from "@/lib/skills-detail";
import * as Icons from "lucide-react";
import { ArrowRight, BadgeCheck, Sparkles } from "lucide-react";

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: "Skills Hub — Learn with Verified Courses | FuturePath AI" },
      {
        name: "description",
        content:
          "Learn communication, coding, leadership, financial literacy and more — with step-by-step plans and free government-verified courses (SWAYAM, NPTEL, Skill India).",
      },
      { property: "og:title", content: "Skills Hub — FuturePath AI" },
      {
        property: "og:description",
        content: "Step-by-step skill roadmaps with free, government-verified learning resources for Indian students.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SkillsPage,
});

const extra = [
  { title: "Government Exams", desc: "UPSC, SSC, Banking, State PSC — preparation roadmaps.", href: "https://www.ncs.gov.in/" },
  { title: "UPSC Guidance", desc: "Prelims, Mains, Interview — strategy and timetables.", href: "https://upsc.gov.in/" },
  { title: "Startup & Entrepreneurship", desc: "Ideation, MVP, funding, scaling — founder playbook.", href: "https://www.startupindia.gov.in/" },
  { title: "Emerging Technologies", desc: "AI, Web3, Quantum, Biotech — the next decade of jobs.", href: "https://futureskillsprime.in/" },
  { title: "Free University Courses", desc: "Credit-transferable courses from IITs and central universities.", href: "https://swayam.gov.in/" },
  { title: "Career Roadmaps", desc: "Step-by-step plans from Class 10 to dream job.", href: "/roadmap" },
];

function SkillsPage() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname !== "/skills") return <Outlet />;

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <div className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">Skills Development</div>
          <h1 className="font-display text-3xl sm:text-5xl font-bold mb-4">Skills that build the future you</h1>
          <p className="text-muted-foreground">
            Tap any skill for a step-by-step learning plan and free, government-verified courses.
          </p>
          <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-primary/10 text-primary">
            <BadgeCheck className="h-3.5 w-3.5" /> SWAYAM · NPTEL · Skill India · RBI · SEBI
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-16">
          {skillsList.map((s) => {
            const Icon = (Icons as any)[s.icon] ?? Icons.Sparkles;
            const slug = skillSlugFromName(s.name);
            const detail = skillDetails.find((d) => d.slug === slug);
            const card = (
              <>
                <div className="grid h-12 w-12 place-items-center rounded-xl gradient-primary text-primary-foreground mb-3 shadow-soft">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">{s.level}</div>
                <h3 className="font-display font-semibold mb-1.5">{s.name}</h3>
                <p className="text-sm text-muted-foreground">{s.description}</p>
                {detail && (
                  <div className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-primary">
                    How to learn this
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </>
            );
            return detail ? (
              <Link
                key={s.name}
                to="/skills/$slug"
                params={{ slug }}
                className="group rounded-2xl border border-border bg-card p-5 sm:p-6 hover-lift"
              >
                {card}
              </Link>
            ) : (
              <div key={s.name} className="rounded-2xl border border-border bg-card p-5 sm:p-6 hover-lift">
                {card}
              </div>
            );
          })}
        </div>

        <div className="mb-8 text-center">
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-2">More to explore</h2>
          <p className="text-muted-foreground">Specialized tracks with official portals for ambitious learners.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {extra.map((e) =>
            e.href.startsWith("/") ? (
              <Link key={e.title} to={e.href} className="group rounded-2xl border border-border bg-card p-5 sm:p-6 hover-lift block">
                <Sparkles className="h-6 w-6 text-primary mb-3" />
                <h3 className="font-display font-semibold mb-1.5 group-hover:text-primary transition-colors">{e.title}</h3>
                <p className="text-sm text-muted-foreground">{e.desc}</p>
              </Link>
            ) : (
              <a
                key={e.title}
                href={e.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group rounded-2xl border border-border bg-card p-5 sm:p-6 hover-lift block"
              >
                <Sparkles className="h-6 w-6 text-primary mb-3" />
                <h3 className="font-display font-semibold mb-1.5 group-hover:text-primary transition-colors">{e.title}</h3>
                <p className="text-sm text-muted-foreground">{e.desc}</p>
                <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                  <BadgeCheck className="h-3.5 w-3.5" /> Official portal
                </div>
              </a>
            ),
          )}
        </div>
      </section>
    </Layout>
  );
}
