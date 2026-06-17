import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { skillsList } from "@/lib/data";
import * as Icons from "lucide-react";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/skills")({
  head: () => ({
    meta: [
      { title: "Skills Hub — FuturePath AI" },
      { name: "description", content: "Build communication, coding, leadership, financial literacy and career-ready skills." },
    ],
  }),
  component: SkillsPage,
});

const extra = [
  { title: "Government Exams", desc: "UPSC, SSC, Banking, State PSC — preparation roadmaps." },
  { title: "UPSC Guidance", desc: "Prelims, Mains, Interview — strategy and timetables." },
  { title: "Startup & Entrepreneurship", desc: "Ideation, MVP, funding, scaling — founder playbook." },
  { title: "Emerging Technologies", desc: "AI, Web3, Quantum, Biotech — the next decade of jobs." },
  { title: "Future Careers", desc: "Roles that didn't exist 5 years ago — prompt engineer, ESG analyst…" },
  { title: "Career Roadmaps", desc: "Step-by-step plans from Class 10 to dream job." },
];

function SkillsPage() {
  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">Skills Development</div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">Skills that build the future you</h1>
          <p className="text-muted-foreground">Master the human and technical skills employers and entrepreneurs need today.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16">
          {skillsList.map((s) => {
            const Icon = (Icons as any)[s.icon] ?? Icons.Sparkles;
            return (
              <div key={s.name} className="rounded-2xl border border-border bg-card p-6 hover-lift">
                <div className="grid h-12 w-12 place-items-center rounded-xl gradient-primary text-primary-foreground mb-3 shadow-soft"><Icon className="h-6 w-6" /></div>
                <div className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">{s.level}</div>
                <h3 className="font-display font-semibold mb-1.5">{s.name}</h3>
                <p className="text-sm text-muted-foreground">{s.description}</p>
              </div>
            );
          })}
        </div>

        <div className="mb-8 text-center">
          <h2 className="font-display text-3xl font-bold mb-2">More to explore</h2>
          <p className="text-muted-foreground">Specialized tracks for ambitious learners.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {extra.map((e) => (
            <div key={e.title} className="rounded-2xl border border-border bg-card p-6 hover-lift">
              <Sparkles className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-display font-semibold mb-1.5">{e.title}</h3>
              <p className="text-sm text-muted-foreground">{e.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
