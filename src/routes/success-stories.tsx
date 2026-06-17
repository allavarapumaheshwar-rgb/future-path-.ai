import { createFileRoute } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { successStories } from "@/lib/data";
import { Quote, Star } from "lucide-react";

export const Route = createFileRoute("/success-stories")({
  head: () => ({
    meta: [
      { title: "Success Stories — FuturePath AI" },
      { name: "description", content: "Real students. Real wins. Inspiring journeys from school to dream careers." },
    ],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">Success Stories</div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4">Real students. Real wins.</h1>
          <p className="text-muted-foreground">Stories from students who turned guidance into greatness.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {successStories.map((s) => (
            <div key={s.name} className="relative rounded-2xl border border-border bg-card p-7 hover-lift">
              <Quote className="absolute right-5 top-5 h-8 w-8 text-primary/15" />
              <div className="flex items-center gap-1 mb-3">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />)}</div>
              <p className="text-foreground/80 mb-5 leading-relaxed">"{s.story}"</p>
              <div className="border-t border-border pt-4 flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-full gradient-primary text-primary-foreground font-bold">{s.name.charAt(0)}</div>
                <div>
                  <div className="font-semibold text-sm">{s.name}</div>
                  <div className="text-xs text-primary font-medium">{s.role}</div>
                  <div className="text-xs text-muted-foreground">{s.stream}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
