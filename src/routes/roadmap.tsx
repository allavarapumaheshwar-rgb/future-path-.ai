import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { Layout } from "@/components/Layout";
import { RoadmapTimeline } from "@/components/RoadmapTimeline";
import { careers } from "@/lib/data";
import { buildCareerRoadmap, progressPercent, type Roadmap, type RoadmapStage } from "@/lib/roadmap";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";

import { toast } from "sonner";
import { Bookmark, Loader2, Map, Route as RouteIcon, Search, Sparkles, Wand2 } from "lucide-react";

const searchSchema = z.object({ career: z.string().optional() });

export const Route = createFileRoute("/roadmap")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Career Roadmap Builder — FuturePath AI" },
      {
        name: "description",
        content:
          "Build a step-by-step career roadmap: pick any career or let AI generate a personalised timeline of exams, courses, skills and milestones.",
      },
      { property: "og:title", content: "Career Roadmap Builder — FuturePath AI" },
      {
        property: "og:description",
        content: "Plan your path from Class 10 to your dream career with a stage-by-stage roadmap you can track.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RoadmapPage,
});

function RoadmapPage() {
  const { career: careerParam } = Route.useSearch();
  const [query, setQuery] = useState("");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(careerParam ?? careers[0]?.slug ?? null);
  const [aiRoadmap, setAiRoadmap] = useState<Roadmap | null>(null);
  const [aiInput, setAiInput] = useState("");
  const [aiContext, setAiContext] = useState("");
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [completed, setCompleted] = useState<number[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null));
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return careers;
    return careers.filter((c) => c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q));
  }, [query]);

  const curated = useMemo(() => {
    const c = careers.find((x) => x.slug === selectedSlug);
    return c ? buildCareerRoadmap(c) : null;
  }, [selectedSlug]);

  const roadmap: Roadmap | null = aiRoadmap ?? curated;
  const stages: RoadmapStage[] = roadmap?.stages ?? [];
  const percent = progressPercent(stages, completed);

  // Load any saved progress for the selected curated roadmap.
  useEffect(() => {
    setCompleted([]);
    if (!userId || aiRoadmap || !selectedSlug) return;
    let cancelled = false;
    supabase
      .from("roadmaps")
      .select("completed_steps")
      .eq("user_id", userId)
      .eq("career_slug", selectedSlug)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled && data?.completed_steps) setCompleted(data.completed_steps);
      });
    return () => {
      cancelled = true;
    };
  }, [userId, selectedSlug, aiRoadmap]);

  function toggleStep(index: number) {
    setCompleted((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
  }

  async function generate() {
    const goal = aiInput.trim();
    if (!goal || generating) return;
    setGenerating(true);
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      if (!accessToken) {
        toast.error("Please sign in to generate an AI roadmap.");
        return;
      }
      const res = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ career: goal, context: aiContext.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Could not generate the roadmap.");
        return;
      }
      setAiRoadmap({ careerSlug: null, title: data.title, source: "ai", stages: data.stages });
      setCompleted([]);
      toast.success("Your personalised roadmap is ready.");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  async function saveRoadmap() {
    if (!roadmap || saving) return;
    if (!userId) {
      toast.error("Please sign in to save this roadmap to your dashboard.");
      return;
    }
    setSaving(true);
    try {
      await supabase.from("roadmaps").update({ is_active: false }).eq("user_id", userId);
      const payload = {
        user_id: userId,
        career_slug: roadmap.careerSlug,
        title: roadmap.title,
        source: roadmap.source,
        steps: roadmap.stages as unknown as Json,
        completed_steps: completed,
        is_active: true,
        updated_at: new Date().toISOString(),
      };

      const { error } = roadmap.careerSlug
        ? await supabase.from("roadmaps").upsert(payload, { onConflict: "user_id,career_slug" })
        : await supabase.from("roadmaps").insert(payload);
      if (error) throw error;
      toast.success("Roadmap saved to your dashboard.");
    } catch {
      toast.error("Could not save the roadmap. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Layout>
      <section className="relative gradient-hero text-primary-foreground overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,oklch(1_0_0/0.2),transparent_60%)]" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full bg-white/15 backdrop-blur">
            <RouteIcon className="h-3.5 w-3.5" /> Roadmap Builder
          </span>
          <h1 className="font-display text-3xl sm:text-5xl font-bold mt-4 mb-3">Your career roadmap, stage by stage</h1>
          <p className="text-base sm:text-lg text-white/85 max-w-2xl">
            Pick a career to see the full path — exams, degrees, skills and milestones — or let the AI Mentor build a
            personalised timeline for any goal you have in mind.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12 grid lg:grid-cols-[320px_1fr] gap-6">
        {/* Picker */}
        <aside className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <Map className="h-4 w-4 text-primary" />
              <h2 className="font-display font-bold">Choose a career</h2>
            </div>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search careers…"
                aria-label="Search careers"
                className="w-full rounded-xl border border-input bg-background pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="max-h-[22rem] overflow-y-auto space-y-1 pr-1">
              {filtered.map((c) => {
                const active = !aiRoadmap && c.slug === selectedSlug;
                return (
                  <button
                    key={c.slug}
                    onClick={() => {
                      setAiRoadmap(null);
                      setSelectedSlug(c.slug);
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm transition ${
                      active ? "gradient-primary text-primary-foreground font-semibold" : "hover:bg-muted"
                    }`}
                  >
                    {c.title}
                    <span className={`block text-xs ${active ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                      {c.category}
                    </span>
                  </button>
                );
              })}
              {filtered.length === 0 && <p className="text-sm text-muted-foreground px-1 py-3">No careers match that search.</p>}
            </div>
          </div>

          {/* AI generator */}
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
              <Wand2 className="h-4 w-4 text-primary" />
              <h2 className="font-display font-bold">AI-generated roadmap</h2>
            </div>
            <p className="text-xs text-muted-foreground mb-3">Not in the list? Describe your goal and AI will map it out.</p>
            <input
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              placeholder="e.g. Sports physiotherapist"
              aria-label="Career goal"
              className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm mb-2 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <textarea
              value={aiContext}
              onChange={(e) => setAiContext(e.target.value)}
              rows={2}
              placeholder="Optional: your class, stream or interests"
              aria-label="Your context"
              className="w-full rounded-xl border border-input bg-background px-3 py-2.5 text-sm resize-none mb-3 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
            <button
              onClick={generate}
              disabled={generating || !aiInput.trim()}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl gradient-primary text-primary-foreground font-semibold text-sm disabled:opacity-50 hover-lift"
            >
              {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {generating ? "Generating…" : "Generate with AI"}
            </button>
            {!userId && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                <Link to="/auth" className="text-primary font-medium hover:underline">Sign in</Link> to generate and save roadmaps.
              </p>
            )}
          </div>
        </aside>

        {/* Timeline */}
        <div>
          {roadmap ? (
            <>
              <div className="rounded-2xl border border-border bg-card p-4 sm:p-6 mb-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-xl sm:text-2xl font-bold">{roadmap.title}</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {stages.length} stages · {roadmap.source === "ai" ? "AI-generated for you" : "Curated pathway"}
                    </p>
                  </div>
                  <button
                    onClick={saveRoadmap}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-background text-sm font-semibold hover-lift disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bookmark className="h-4 w-4" />}
                    Save to dashboard
                  </button>
                </div>
                <div className="mt-4">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-medium">Progress</span>
                    <span className="text-muted-foreground">{percent}% complete</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full gradient-primary transition-all" style={{ width: `${percent}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Tick each stage as you complete it.</p>
                </div>
              </div>

              <RoadmapTimeline stages={stages} completed={completed} onToggle={toggleStep} />

              {roadmap.careerSlug && (
                <div className="mt-6">
                  <Link
                    to="/careers/$slug"
                    params={{ slug: roadmap.careerSlug }}
                    className="text-sm text-primary font-semibold hover:underline"
                  >
                    View the full {roadmap.title.replace(" Roadmap", "")} career guide →
                  </Link>
                </div>
              )}
            </>
          ) : (
            <p className="text-muted-foreground">Select a career to see its roadmap.</p>
          )}
        </div>
      </section>
    </Layout>
  );
}
