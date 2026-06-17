import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { scholarships } from "@/lib/data";
import { Award, IndianRupee, GraduationCap, Building } from "lucide-react";

export const Route = createFileRoute("/scholarships")({
  head: () => ({
    meta: [
      { title: "Scholarships — FuturePath AI" },
      { name: "description", content: "Discover scholarships by level and eligibility — fund your education." },
    ],
  }),
  component: ScholarshipsPage,
});

function ScholarshipsPage() {
  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">Scholarships</div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">Fund your future</h1>
          <p className="text-muted-foreground">Government, corporate and international scholarships for every student level.</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {scholarships.map((s) => (
            <div key={s.name} className="rounded-2xl border border-border bg-card p-6 hover-lift relative overflow-hidden">
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full gradient-primary opacity-10 blur-2xl" />
              <Award className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-display text-lg font-bold mb-3">{s.name}</h3>
              <div className="space-y-1.5 text-sm">
                <div className="flex items-center gap-2"><GraduationCap className="h-3.5 w-3.5 text-primary" /><span className="text-muted-foreground">Level:</span> {s.level}</div>
                <div className="flex items-center gap-2"><IndianRupee className="h-3.5 w-3.5 text-primary" /><span className="text-muted-foreground">Amount:</span> {s.amount}</div>
                <div className="flex items-start gap-2"><Building className="h-3.5 w-3.5 text-primary mt-0.5" /><span className="text-muted-foreground">By:</span> {s.provider}</div>
              </div>
              <div className="mt-4 pt-4 border-t border-border text-xs text-foreground/80">
                <span className="font-semibold">Eligibility:</span> {s.eligibility}
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
