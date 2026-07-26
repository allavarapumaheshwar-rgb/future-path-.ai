import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions, useQuery } from "@tanstack/react-query";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import {
  listScholarships,
  getScholarshipFilters,
  toggleSavedScholarship,
  getSavedScholarshipSlugs,
} from "@/lib/scholarships.functions";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import {
  Search, Calendar, Filter, Grid3X3, List, ChevronLeft, ChevronRight, Heart, Share2, X,
  SlidersHorizontal, GraduationCap, MapPin, Clock, Building2, Users,
} from "lucide-react";
import { toast } from "sonner";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  providerType: fallback(z.string(), "").default(""),
  state: fallback(z.string(), "").default(""),
  level: fallback(z.string(), "").default(""),
  category: fallback(z.string(), "").default(""),
  gender: fallback(z.string(), "").default(""),
  stream: fallback(z.string(), "").default(""),
  course: fallback(z.string(), "").default(""),
  closingSoon: fallback(z.enum(["true", "false"]), "false").default("false"),
  sort: fallback(z.string(), "last_date").default("last_date"),
  view: fallback(z.string(), "grid").default("grid"),
  page: fallback(z.number().int(), 1).default(1),
});

const LIMIT = 24;

const scholarshipsQueryOptions = (deps: z.infer<typeof searchSchema>) =>
  queryOptions({
    queryKey: ["scholarships", { ...deps, limit: LIMIT }],
    queryFn: () => listScholarships({ data: { ...deps, limit: LIMIT } }),
  });

const filtersQueryOptions = () =>
  queryOptions({
    queryKey: ["scholarship-filters"],
    queryFn: () => getScholarshipFilters({ data: undefined }),
    staleTime: 5 * 60 * 1000,
  });

export const Route = createFileRoute("/scholarships")({
  validateSearch: zodValidator(searchSchema),
  loaderDeps: ({ search }) => ({ ...search, limit: LIMIT }),
  loader: ({ deps, context }) =>
    context.queryClient.ensureQueryData(scholarshipsQueryOptions(deps)),
  head: () => ({
    meta: [
      { title: "Scholarship Hub — FuturePath AI" },
      { name: "description", content: "Discover 1000+ scholarships for Class 10, Intermediate, Degree, Engineering, Medical and more students across India." },
      { property: "og:title", content: "Scholarship Hub — FuturePath AI" },
      { property: "og:description", content: "Discover 1000+ scholarships for Indian students." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ScholarshipsPage,
  errorComponent: ({ error }) => (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-destructive">{error.message}</div>
    </Layout>
  ),
  notFoundComponent: () => (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">No scholarships found.</div>
    </Layout>
  ),
});

function ScholarshipsPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/scholarships" });
  const { data } = useSuspenseQuery(scholarshipsQueryOptions(search));
  const { data: filters } = useQuery(filtersQueryOptions());
  const [user, setUser] = useState<User | null>(null);
  const [savedSlugs, setSavedSlugs] = useState<Set<string>>(new Set());
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    supabase.auth.getSession().then(({ data: d }) => setUser(d.session?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setSavedSlugs(new Set());
      return;
    }
    getSavedScholarshipSlugs({ data: undefined }).then((slugs) => setSavedSlugs(new Set(slugs)));
  }, [user]);

  const updateSearch = (patch: Partial<z.infer<typeof searchSchema>>) => {
    navigate({ search: (prev: z.infer<typeof searchSchema>) => ({ ...prev, ...patch, page: 1 }), replace: true });
  };

  const clearFilters = () => {
    navigate({
      search: (prev: z.infer<typeof searchSchema>) => ({
        ...prev,
        q: "", providerType: "", state: "", level: "", category: "", gender: "",
        stream: "", course: "", closingSoon: "false", sort: "last_date", page: 1,
      }),
      replace: true,
    });
  };

  const totalPages = Math.ceil((data?.count || 0) / LIMIT);

  const toggleSave = async (slug: string, name: string, deadline: string | null) => {
    if (!user) {
      toast.info("Sign in to save scholarships");
      navigate({ to: "/auth", search: { mode: "login" } });
      return;
    }
    const result = await toggleSavedScholarship({ data: { slug, name, deadline } });
    setSavedSlugs((prev) => {
      const next = new Set(prev);
      if (result.saved) next.add(slug);
      else next.delete(slug);
      return next;
    });
    toast.success(result.saved ? "Saved to tracker" : "Removed from tracker");
  };

  const shareScholarship = (slug: string, name: string) => {
    const url = `${window.location.origin}/scholarships/${slug}`;
    navigator.clipboard.writeText(url).then(() => toast.success(`Link copied for ${name}`));
  };

  const activeFiltersCount = [
    search.providerType, search.state, search.level, search.category, search.gender,
    search.stream, search.course, search.closingSoon === "true" ? "closing" : "",
  ].filter(Boolean).length;

  const FilterContent = () => (
    <div className="space-y-5">
      <div className="flex items-center justify-between lg:hidden">
        <h3 className="font-semibold">Filters</h3>
        <button onClick={() => setMobileFiltersOpen(false)} className="p-1 rounded hover:bg-muted"><X className="h-4 w-4" /></button>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sort by</label>
        <select
          value={search.sort}
          onChange={(e) => updateSearch({ sort: e.target.value })}
          className="mt-1.5 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option value="last_date">Closing Soon</option>
          <option value="newest">Newly Added</option>
          <option value="name">Name A-Z</option>
        </select>
      </div>

      <FilterSelect label="Provider Type" value={search.providerType} options={filters?.providerTypes ?? []} onChange={(v) => updateSearch({ providerType: v })} />
      <FilterSelect label="State" value={search.state} options={filters?.states ?? []} onChange={(v) => updateSearch({ state: v })} />
      <FilterSelect label="Education Level" value={search.level} options={filters?.levels ?? []} onChange={(v) => updateSearch({ level: v })} />
      <FilterSelect label="Category" value={search.category} options={filters?.categories ?? []} onChange={(v) => updateSearch({ category: v })} />
      <FilterSelect label="Gender" value={search.gender} options={filters?.genders ?? []} onChange={(v) => updateSearch({ gender: v })} />
      <FilterSelect label="Stream" value={search.stream} options={filters?.streams ?? []} onChange={(v) => updateSearch({ stream: v })} />
      <FilterSelect label="Course" value={search.course} options={filters?.courses ?? []} onChange={(v) => updateSearch({ course: v })} />

      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={search.closingSoon === "true"}
          onChange={(e) => updateSearch({ closingSoon: e.target.checked ? "true" : "false" })}
          className="h-4 w-4 rounded border-border text-primary"
        />
        Closing in 30 days
      </label>

      {activeFiltersCount > 0 && (
        <button onClick={clearFilters} className="text-sm text-primary font-medium hover:underline">Clear all filters</button>
      )}
    </div>
  );

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10 sm:py-16">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">Scholarship Hub</div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Funding your future</h1>
          <p className="text-muted-foreground">Explore 1000+ scholarships from central and state governments, UGC, AICTE, foundations and corporates.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 rounded-2xl border border-border bg-card p-5 shadow-soft">
              <div className="flex items-center gap-2 mb-4">
                <SlidersHorizontal className="h-4 w-4 text-primary" />
                <h2 className="font-semibold">Filters</h2>
              </div>
              <FilterContent />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  value={search.q}
                  onChange={(e) => updateSearch({ q: e.target.value })}
                  placeholder="Search scholarships by name or provider…"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden inline-flex items-center gap-1.5 px-4 py-3 rounded-xl border border-border bg-card text-sm font-medium"
                >
                  <Filter className="h-4 w-4" /> Filters {activeFiltersCount > 0 && <span className="ml-1 h-5 w-5 grid place-items-center rounded-full bg-primary text-primary-foreground text-xs">{activeFiltersCount}</span>}
                </button>
                <div className="flex rounded-xl border border-border bg-card p-1">
                  <button
                    onClick={() => updateSearch({ view: "grid" })}
                    className={`p-2 rounded-lg ${search.view === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    aria-label="Grid view"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => updateSearch({ view: "list" })}
                    className={`p-2 rounded-lg ${search.view === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                    aria-label="List view"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {search.q && <Chip label={`Search: ${search.q}`} onRemove={() => updateSearch({ q: "" })} />}
                {search.providerType && <Chip label={search.providerType} onRemove={() => updateSearch({ providerType: "" })} />}
                {search.state && <Chip label={search.state} onRemove={() => updateSearch({ state: "" })} />}
                {search.level && <Chip label={search.level} onRemove={() => updateSearch({ level: "" })} />}
                {search.category && <Chip label={search.category} onRemove={() => updateSearch({ category: "" })} />}
                {search.gender && <Chip label={search.gender} onRemove={() => updateSearch({ gender: "" })} />}
                {search.stream && <Chip label={search.stream} onRemove={() => updateSearch({ stream: "" })} />}
                {search.course && <Chip label={search.course} onRemove={() => updateSearch({ course: "" })} />}
                {search.closingSoon === "true" && <Chip label="Closing soon" onRemove={() => updateSearch({ closingSoon: "false" })} />}
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <span>{data?.count ?? 0} scholarships found</span>
              <span>Page {search.page} of {Math.max(1, totalPages)}</span>
            </div>

            {search.view === "grid" ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                {data?.scholarships.map((s) => (
                  <ScholarshipCard key={s.id} scholarship={s} saved={savedSlugs.has(s.slug)} onToggleSave={() => toggleSave(s.slug, s.name, s.application_last)} onShare={() => shareScholarship(s.slug, s.name)} view="grid" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {data?.scholarships.map((s) => (
                  <ScholarshipCard key={s.id} scholarship={s} saved={savedSlugs.has(s.slug)} onToggleSave={() => toggleSave(s.slug, s.name, s.application_last)} onShare={() => shareScholarship(s.slug, s.name)} view="list" />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  disabled={search.page <= 1}
                  onClick={() => updateSearch({ page: search.page - 1 })}
                  className="p-2 rounded-lg border border-border bg-card disabled:opacity-40 hover:bg-primary/5"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let p = i + 1;
                  if (totalPages > 5 && search.page > 3) p = search.page - 2 + i;
                  if (p > totalPages) return null;
                  return (
                    <button
                      key={p}
                      onClick={() => updateSearch({ page: p })}
                      className={`h-9 w-9 rounded-lg text-sm font-medium ${search.page === p ? "gradient-primary text-primary-foreground" : "border border-border bg-card hover:bg-primary/5"}`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  disabled={search.page >= totalPages}
                  onClick={() => updateSearch({ page: search.page + 1 })}
                  className="p-2 rounded-lg border border-border bg-card disabled:opacity-40 hover:bg-primary/5"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-card border-l border-border p-5 overflow-y-auto">
            <FilterContent />
          </div>
        </div>
      )}
    </Layout>
  );
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-lg border border-border bg-card px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        <option value="">All {label}s</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
      {label}
      <button onClick={onRemove} className="hover:text-destructive"><X className="h-3 w-3" /></button>
    </span>
  );
}

function ScholarshipCard({
  scholarship,
  saved,
  onToggleSave,
  onShare,
  view,
}: {
  scholarship: Awaited<ReturnType<typeof listScholarships>>["scholarships"][number];
  saved: boolean;
  onToggleSave: () => void;
  onShare: () => void;
  view: "grid" | "list";
}) {
  const deadlineText = scholarship.application_last
    ? new Date(scholarship.application_last).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
    : "Check website";

  const isClosingSoon = scholarship.application_last
    ? new Date(scholarship.application_last).getTime() - Date.now() < 30 * 24 * 60 * 60 * 1000
    : false;

  if (view === "list") {
    return (
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-soft hover-lift flex flex-col sm:flex-row gap-4">
        <div className="shrink-0 grid h-14 w-14 place-items-center rounded-xl bg-primary/10 text-primary text-lg font-bold">
          {scholarship.provider?.slice(0, 2).toUpperCase() || "SP"}
        </div>
        <div className="flex-1 min-w-0">
          <Link to="/scholarships/$slug" params={{ slug: scholarship.slug }} className="font-display text-lg font-bold hover:text-primary line-clamp-2">
            {scholarship.name}
          </Link>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground mt-1">
            <span className="inline-flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> {scholarship.provider}</span>
            <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {scholarship.state || "All India"}</span>
            <span className="inline-flex items-center gap-1"><GraduationCap className="h-3.5 w-3.5" /> {scholarship.level?.join(", ")}</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {scholarship.category?.slice(0, 3).map((c) => (
              <span key={c} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{c}</span>
            ))}
          </div>
        </div>
        <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0">
          <div className={`text-xs px-2 py-1 rounded-full inline-flex items-center gap-1 ${isClosingSoon ? "bg-rose-500/10 text-rose-600" : "bg-muted text-muted-foreground"}`}>
            <Clock className="h-3 w-3" /> {deadlineText}
          </div>
          <div className="flex gap-1">
            <button onClick={onToggleSave} className={`p-2 rounded-lg ${saved ? "text-rose-500 bg-rose-50" : "text-muted-foreground hover:bg-primary/5 hover:text-rose-500"}`} aria-label="Save">
              <Heart className={`h-5 w-5 ${saved ? "fill-current" : ""}`} />
            </button>
            <button onClick={onShare} className="p-2 rounded-lg text-muted-foreground hover:bg-primary/5 hover:text-primary" aria-label="Share">
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft hover-lift flex flex-col">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary text-sm font-bold">
          {scholarship.provider?.slice(0, 2).toUpperCase() || "SP"}
        </div>
        <div className="flex gap-1 shrink-0">
          <button onClick={onToggleSave} className={`p-1.5 rounded-lg ${saved ? "text-rose-500 bg-rose-50" : "text-muted-foreground hover:bg-primary/5 hover:text-rose-500"}`} aria-label="Save">
            <Heart className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
          </button>
          <button onClick={onShare} className="p-1.5 rounded-lg text-muted-foreground hover:bg-primary/5 hover:text-primary" aria-label="Share">
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>
      <Link to="/scholarships/$slug" params={{ slug: scholarship.slug }} className="font-display text-base font-bold hover:text-primary line-clamp-2 min-h-[2.75rem]">
        {scholarship.name}
      </Link>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-2">
        <span className="inline-flex items-center gap-1"><Building2 className="h-3 w-3" /> {scholarship.provider}</span>
        <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {scholarship.state || "All India"}</span>
      </div>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {scholarship.level?.slice(0, 2).map((l) => (
          <span key={l} className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{l}</span>
        ))}
      </div>
      <div className="mt-auto pt-4 flex items-center justify-between text-sm">
        <span className="font-semibold text-primary">{scholarship.amount || "Variable"}</span>
        <span className={`text-xs px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${isClosingSoon ? "bg-rose-500/10 text-rose-600" : "bg-muted text-muted-foreground"}`}>
          <Calendar className="h-3 w-3" /> {deadlineText}
        </span>
      </div>
    </div>
  );
}
