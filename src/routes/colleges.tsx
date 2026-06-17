import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { colleges } from "@/lib/data";
import { Search, MapPin, Trophy } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/colleges")({
  head: () => ({
    meta: [
      { title: "College Finder — FuturePath AI" },
      { name: "description", content: "Browse top Engineering, Medical, Commerce, Arts and Professional colleges in India." },
    ],
  }),
  component: CollegesPage,
});

function CollegesPage() {
  const [q, setQ] = useState("");
  const [type, setType] = useState("All");
  const types = useMemo(() => ["All", ...Array.from(new Set(colleges.map((c) => c.type)))], []);
  const filtered = colleges.filter((c) =>
    (type === "All" || c.type === type) &&
    (q === "" || c.name.toLowerCase().includes(q.toLowerCase()) || c.location.toLowerCase().includes(q.toLowerCase())),
  );

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">College Finder</div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">Find your dream college</h1>
          <p className="text-muted-foreground">Top-ranked institutions across Engineering, Medical, Commerce, Arts, Law and Management.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search colleges or cities…"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {types.map((t) => (
              <button key={t} onClick={() => setType(t)}
                className={`px-3 py-2 text-sm rounded-lg font-medium ${type === t ? "gradient-primary text-primary-foreground" : "bg-card border border-border hover:bg-primary/5"}`}>{t}</button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((c) => (
            <div key={c.name} className="rounded-2xl border border-border bg-card p-6 hover-lift">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">{c.type}</span>
                <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-semibold"><Trophy className="h-3 w-3" /> {c.rank}</span>
              </div>
              <h3 className="font-display text-lg font-bold mb-1">{c.name}</h3>
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4"><MapPin className="h-3.5 w-3.5" /> {c.location}</div>
              <div className="flex flex-wrap gap-1.5">
                {c.courses.map((co) => <span key={co} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{co}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
