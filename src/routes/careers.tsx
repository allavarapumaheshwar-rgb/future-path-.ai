import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { careers } from "@/lib/data";
import { Search, ArrowRight } from "lucide-react";
import { useMemo, useState } from "react";
import * as Icons from "lucide-react";

export const Route = createFileRoute("/careers")({
  head: () => ({
    meta: [
      { title: "Career Encyclopedia — FuturePath AI" },
      { name: "description", content: "20+ detailed careers with skills, salary, eligibility and growth paths." },
    ],
  }),
  component: CareersPage,
});

function CareersPage() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname !== "/careers") return <Outlet />;

  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");
  const cats = useMemo(() => ["All", ...Array.from(new Set(careers.map((c) => c.category)))], []);
  const filtered = careers.filter((c) =>
    (cat === "All" || c.category === cat) &&
    (q === "" || c.title.toLowerCase().includes(q.toLowerCase()) || c.overview.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">Career Encyclopedia</div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">Explore 20+ in-demand careers</h1>
          <p className="text-muted-foreground">Detailed roadmaps, skills, salaries and growth trajectories for every career.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search careers…"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {cats.map((c) => (
              <button key={c} onClick={() => setCat(c)}
                className={`px-3 py-2 text-sm rounded-lg font-medium transition-colors ${cat === c ? "gradient-primary text-primary-foreground" : "bg-card border border-border hover:bg-primary/5"}`}>{c}</button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c) => {
            const Icon = (Icons as any)[c.icon] ?? Icons.Briefcase;
            return (
              <Link key={c.slug} to="/careers/$slug" params={{ slug: c.slug }} className="group rounded-2xl border border-border bg-card p-6 hover-lift">
                <div className="flex items-start justify-between mb-3">
                  <div className="grid h-12 w-12 place-items-center rounded-xl gradient-primary text-primary-foreground shadow-soft"><Icon className="h-6 w-6" /></div>
                  <span className="text-xs font-semibold text-primary uppercase tracking-wide">{c.category}</span>
                </div>
                <h3 className="font-display text-lg font-semibold mb-1.5 group-hover:text-primary transition-colors">{c.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{c.overview}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{c.salary}</span>
                  <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
        {filtered.length === 0 && <div className="text-center py-16 text-muted-foreground">No careers match your search.</div>}
      </section>
    </Layout>
  );
}
