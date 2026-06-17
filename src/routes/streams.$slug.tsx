import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { streams } from "@/lib/data";
import { ArrowLeft, BookOpen, Brain, GraduationCap, Briefcase, TrendingUp, Building2, Landmark, Rocket, IndianRupee, Sparkles } from "lucide-react";

export const Route = createFileRoute("/streams/$slug")({
  loader: ({ params }) => {
    const stream = streams.find((s) => s.slug === params.slug);
    if (!stream) throw notFound();
    return { stream };
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.stream.code} — ${loaderData.stream.name} | FuturePath AI` },
      { name: "description", content: loaderData.stream.description },
    ] : [],
  }),
  component: StreamDetail,
  notFoundComponent: () => (
    <Layout><div className="mx-auto max-w-3xl px-4 py-24 text-center"><h1 className="text-3xl font-bold">Stream not found</h1><Link to="/streams" className="mt-6 inline-block text-primary">Back to streams</Link></div></Layout>
  ),
});

function Section({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
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

function Pills({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((i) => <span key={i} className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">{i}</span>)}
    </div>
  );
}

function StreamDetail() {
  const { stream } = Route.useLoaderData();
  return (
    <Layout>
      <section className="relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${stream.gradient} opacity-95`} />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,oklch(1_0_0/0.2),transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-16 text-white">
          <Link to="/streams" className="inline-flex items-center gap-2 text-sm text-white/80 hover:text-white mb-6"><ArrowLeft className="h-4 w-4" /> All streams</Link>
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-white/15 backdrop-blur border border-white/20 font-bold text-2xl mb-4">{stream.code}</div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3">{stream.name}</h1>
          <p className="text-lg text-white/85 max-w-2xl">{stream.description}</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-12 grid lg:grid-cols-2 gap-5">
        <Section icon={BookOpen} title="Core Subjects"><Pills items={stream.subjects} /></Section>
        <Section icon={Brain} title="Skills Required"><Pills items={stream.skills} /></Section>
        <Section icon={GraduationCap} title="Recommended Courses"><Pills items={stream.courses} /></Section>
        <Section icon={Briefcase} title="Career Opportunities"><Pills items={stream.careers} /></Section>
        <Section icon={Building2} title="Higher Education"><Pills items={stream.higherEducation} /></Section>
        <Section icon={IndianRupee} title="Salary Insights">
          <p className="text-sm text-foreground/80">{stream.salary}</p>
        </Section>
        <Section icon={TrendingUp} title="Future Scope">
          <p className="text-sm text-foreground/80">{stream.futureScope}</p>
        </Section>
        <Section icon={Rocket} title="Business Opportunities"><Pills items={stream.businessOpps} /></Section>
        <div className="lg:col-span-2">
          <Section icon={Landmark} title="Government Job Opportunities"><Pills items={stream.govtJobs} /></Section>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 pb-20">
        <div className="rounded-3xl gradient-primary p-10 text-center text-primary-foreground">
          <Sparkles className="h-8 w-8 mx-auto mb-3 opacity-90" />
          <h2 className="font-display text-3xl font-bold mb-3">Not sure if {stream.code} is right for you?</h2>
          <p className="mb-6 text-white/85">Take the AI quiz to get matched with your ideal stream.</p>
          <Link to="/quiz" className="inline-flex px-6 py-3 rounded-xl bg-white text-primary font-semibold hover-lift">Take Career Quiz</Link>
        </div>
      </section>
    </Layout>
  );
}
