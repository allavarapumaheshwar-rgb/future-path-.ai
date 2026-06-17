import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { streams } from "@/lib/data";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/streams")({
  head: () => ({
    meta: [
      { title: "Stream Explorer — FuturePath AI" },
      { name: "description", content: "Explore MPC, BiPC, CEC, MEC and Arts streams with full career roadmaps." },
    ],
  }),
  component: StreamsPage,
});

function StreamsPage() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname !== "/streams") return <Outlet />;
  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">Stream Explorer</div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">Pick the stream that fits you</h1>
          <p className="text-muted-foreground">Each stream opens a universe of careers. Dive in to see subjects, skills, salaries and future scope.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {streams.map((s) => (
            <Link key={s.slug} to="/streams/$slug" params={{ slug: s.slug }} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 hover-lift">
              <div className={`absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br ${s.gradient} opacity-10 group-hover:opacity-20 blur-2xl transition`} />
              <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${s.gradient} text-white font-bold text-lg mb-4 shadow-soft`}>{s.code}</div>
              <h3 className="font-display text-xl font-bold mb-1.5">{s.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">{s.tagline}</p>
              <div className="flex flex-wrap gap-1.5 mb-5">
                {s.careers.slice(0, 4).map((c) => (
                  <span key={c} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">{c}</span>
                ))}
              </div>
              <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">Explore stream <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></div>
            </Link>
          ))}
        </div>
      </section>
    </Layout>
  );
}
