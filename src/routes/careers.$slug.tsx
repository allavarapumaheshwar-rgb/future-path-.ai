import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { RoadmapTimeline } from "@/components/RoadmapTimeline";
import { buildCareerRoadmap } from "@/lib/roadmap";
import { careers } from "@/lib/data";

import * as Icons from "lucide-react";
import { ArrowLeft, BookOpen, Brain, GraduationCap, IndianRupee, TrendingUp, Rocket, Target, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/careers/$slug")({
  loader: ({ params }) => {
    const career = careers.find((c) => c.slug === params.slug);
    if (!career) throw notFound();
    return { career };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.career.title} — Career Guide | FuturePath AI` },
      { name: "description", content: loaderData.career.overview },
    ] : [],
  }),
  component: CareerDetail,
  notFoundComponent: () => (
    <Layout><div className="mx-auto max-w-3xl px-4 py-24 text-center"><h1 className="text-3xl font-bold">Career not found</h1><Link to="/careers" className="mt-6 inline-block text-primary">Back to careers</Link></div></Layout>
  ),
});

function Card({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-2.5 mb-4">
        <div className="grid h-9 w-9 place-items-center rounded-lg gradient-primary text-primary-foreground"><Icon className="h-4.5 w-4.5" /></div>
        <h3 className="font-display font-semibold">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function CareerDetail() {
  const { career } = Route.useLoaderData();
  const Icon = (Icons as any)[career.icon] ?? Icons.Briefcase;
  return (
    <Layout>
      <section className="relative gradient-hero text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,oklch(1_0_0/0.2),transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16">
          <Link to="/careers" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white mb-6"><ArrowLeft className="h-4 w-4" /> All careers</Link>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/15 backdrop-blur border border-white/20"><Icon className="h-8 w-8" /></div>
            <span className="text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-white/15 backdrop-blur">{career.category}</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3">{career.title}</h1>
          <p className="text-lg text-white/85 max-w-2xl">{career.overview}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 grid lg:grid-cols-2 gap-5">
        <Card icon={BookOpen} title="Eligibility"><p className="text-sm text-foreground/80">{career.eligibility}</p></Card>
        <Card icon={IndianRupee} title="Salary"><p className="text-sm text-foreground/80">{career.salary}</p></Card>
        <Card icon={Brain} title="Skills Required">
          <div className="flex flex-wrap gap-2">{career.skills.map((s: string) => <span key={s} className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">{s}</span>)}</div>
        </Card>
        <Card icon={GraduationCap} title="Courses">
          <div className="flex flex-wrap gap-2">{career.courses.map((s: string) => <span key={s} className="text-sm px-3 py-1 rounded-full bg-accent text-accent-foreground font-medium">{s}</span>)}</div>
        </Card>
        <div className="lg:col-span-2">
          <Card icon={Target} title="Career Roadmap">
            <RoadmapTimeline stages={buildCareerRoadmap(career).stages} />
            <Link
              to="/roadmap"
              search={{ career: career.slug }}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold hover-lift"
            >
              Open in Roadmap Builder →
            </Link>
          </Card>
        </div>

        <Card icon={TrendingUp} title="Future Demand"><p className="text-sm text-foreground/80">{career.futureDemand}</p></Card>
        <Card icon={Rocket} title="Growth Opportunities"><p className="text-sm text-foreground/80">{career.growth}</p></Card>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-20">
        <div className="rounded-3xl border border-border bg-card p-8 sm:p-10 text-center">
          <CheckCircle2 className="h-8 w-8 mx-auto mb-3 text-primary" />
          <h2 className="font-display text-2xl sm:text-3xl font-bold mb-2">Ready to begin?</h2>
          <p className="text-muted-foreground mb-6">Explore relevant streams or take the quiz to confirm your path.</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/streams" className="px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground font-semibold hover-lift">Explore Streams</Link>
            <Link to="/quiz" className="px-5 py-2.5 rounded-xl border border-border bg-background font-semibold hover-lift">Take Quiz</Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
