import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions, useQuery } from "@tanstack/react-query";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import {
  listColleges,
  getCollegeFilters,
  toggleSavedCollege,
  getSavedCollegeSlugs,
} from "@/lib/colleges.functions";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import {
  Search, MapPin, Trophy, GraduationCap, Building2, Home, Filter,
  Grid3X3, List, ChevronLeft, ChevronRight, Heart, Share2, X, SlidersHorizontal,
} from "lucide-react";
import { toast } from "sonner";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
  state: fallback(z.string(), "").default(""),
  district: fallback(z.string(), "").default(""),
  city: fallback(z.string(), "").default(""),
  type: fallback(z.string(), "").default(""),
  category: fallback(z.string(), "").default(""),
  course: fallback(z.string(), "").default(""),
  exam: fallback(z.string(), "").default(""),
  minFee: fallback(z.number(), 0).default(0),
  maxFee: fallback(z.number(), 5000000).default(5000000),
  hostel: fallback(z.enum(["true", "false"]), "false").default("false"),
  sort: fallback(z.string(), "ranking").default("ranking"),
  view: fallback(z.string(), "grid").default("grid"),
  page: fallback(z.number().int(), 1).default(1),
});

const LIMIT = 24;

const collegesQueryOptions = (deps: z.infer<typeof searchSchema>) =>
  queryOptions({
    queryKey: ["colleges", { ...deps, limit: LIMIT }],
    queryFn: () => listColleges({ data: { ...deps, limit: LIMIT } }),
  });

const filtersQueryOptions = () =>
  queryOptions({
    queryKey: ["college-filters"],
    queryFn: () => getCollegeFilters({ data: undefined }),
    staleTime: 5 * 60 * 1000,
  });

export const Route = createFileRoute("/colleges")({
  validateSearch: zodValidator(searchSchema),
  loaderDeps: ({ search }) => ({ ...search, limit: LIMIT }),
  loader: ({ deps, context }) =>
    context.queryClient.ensureQueryData(collegesQueryOptions(deps)),
  head: () => ({
    meta: [
      { title: "College Finder — FuturePath AI" },
      { name: "description", content: "Browse 500+ Engineering, Medical, Commerce, Arts and Professional colleges in India. Search by state, city, course, fee and exam." },
      { property: "og:title", content: "College Finder — FuturePath AI" },
      { property: "og:description", content: "Browse 500+ Engineering, Medical, Commerce, Arts and Professional colleges in India." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CollegesPage,
  errorComponent: ({ error }) => (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-destructive">{error.message}</div>
    </Layout>
  ),
  notFoundComponent: () => (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">No colleges found.</div>
    </Layout>
  ),
});

function CollegesPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/colleges" });
  const { data } = useSuspenseQuery(collegesQueryOptions(search));
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
    getSavedCollegeSlugs({ data: undefined }).then((slugs) => setSavedSlugs(new Set(slugs)));
  }, [user]);

  const updateSearch = (patch: Partial<z.infer<typeof searchSchema>>) => {
    navigate({ search: (prev: z.infer<typeof searchSchema>) => ({ ...prev, ...patch, page: 1 }), replace: true });
  };

  const clearFilters = () => {
    navigate({
      search: (prev: z.infer<typeof searchSchema>) => ({
        ...prev,
        q: "", state: "", district: "", city: "", type: "", category: "",
        course: "", exam: "", minFee: 0, maxFee: 5000000, hostel: "false",
        sort: "ranking", page: 1,
      }),
      replace: true,
    });
  };

  const totalPages = Math.ceil((data?.count || 0) / LIMIT);

  const toggleSave = async (slug: string, name: string) => {
    if (!user) {
      toast.info("Sign in to save colleges");
      navigate({ to: "/auth", search: { mode: "login" } });
      return;
    }
    const result = await toggleSavedCollege({ data: { slug, name } });
    setSavedSlugs((prev) => {
      const next = new Set(prev);
      if (result.saved) next.add(slug);
      else next.delete(slug);
      return next;
    });
    toast.success(result.saved ? "Saved to wishlist" : "Removed from wishlist");
  };

  const shareCollege = (slug: string, name: string) => {
    const url = `${window.location.origin}/colleges/${slug}`;
    navigator.clipboard.writeText(url).then(() => toast.success(`Link copied for ${name}`));
  };

  const activeFiltersCount = [
    search.state, search.district, search.city, search.type, search.category,
    search.course, search.exam, search.hostel === "true" ? "hostel" : "",
  ].filter(Boolean).length + (search.minFee > 0 || search.maxFee < 5000000 ? 1 : 0);

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
          <option value="ranking">Ranking</option>
          <option value="fees_asc">Fees: Low to High</option>
          <option value="fees_desc">Fees: High to Low</option>
          <option value="name">Name A-Z</option>
        </select>
      </div>

      <FilterSelect label="State" value={search.state} options={filters?.states ?? []} onChange={(v) => updateSearch({ state: v, district: "", city: "" })} />
      <FilterSelect label="District" value={search.district} options={[]} onChange={(v) => updateSearch({ district: v })} />
      <FilterSelect label="City" value={search.city} options={[]} onChange={(v) => updateSearch({ city: v })} />
      <FilterSelect label="College Type" value={search.type} options={filters?.types ?? []} onChange={(v) => updateSearch({ type: v })} />
      <FilterSelect label="Category" value={search.category} options={filters?.categories ?? []} onChange={(v) => updateSearch({ category: v })} />
      <FilterSelect label="Course" value={search.course} options={filters?.courses ?? []} onChange={(v) => updateSearch({ course: v })} />
      <FilterSelect label="Entrance Exam" value={search.exam} options={filters?.exams ?? []} onChange={(v) => updateSearch({ exam: v })} />

      <div>
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Fee Range (₹)</label>
        <div className="mt-2 flex items-center gap-2">
          <input
            type="number"
            value={search.minFee}
            onChange={(e) => updateSearch({ minFee: Number(e.target.value) })}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
            placeholder="Min"
          />
          <span className="text-muted-foreground">-</span>
          <input
            type="number"
            value={search.maxFee}
            onChange={(e) => updateSearch({ maxFee: Number(e.target.value) })}
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm"
            placeholder="Max"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input
          type="checkbox"
          checked={search.hostel === "true"}
          onChange={(e) => updateSearch({ hostel: e.target.checked ? "true" : "false" })}
          className="h-4 w-4 rounded border-border text-primary"
        />
        Hostel available
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
          <div className="text-sm font-semibold uppercase tracking-widest text-primary mb-2">College Finder</div>
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">Find your dream college</h1>
          <p className="text-muted-foreground">Browse 500+ institutions across Engineering, Medical, Commerce, Arts, Law and more.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Desktop filters */}
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
            {/* Search + controls */}
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  value={search.q}
                  onChange={(e) => updateSearch({ q: e.target.value })}
                  placeholder="Search colleges, cities or states…"
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

            {/* Active filter chips */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {search.q && <Chip label={`Search: ${search.q}`} onRemove={() => updateSearch({ q: "" })} />}
                {search.state && <Chip label={search.state} onRemove={() => updateSearch({ state: "" })} />}
                {search.type && <Chip label={search.type} onRemove={() => updateSearch({ type: "" })} />}
                {search.category && <Chip label={search.category} onRemove={() => updateSearch({ category: "" })} />}
                {search.course && <Chip label={search.course} onRemove={() => updateSearch({ course: "" })} />}
                {search.exam && <Chip label={search.exam} onRemove={() => updateSearch({ exam: "" })} />}
                {search.hostel === "true" && <Chip label="Hostel" onRemove={() => updateSearch({ hostel: "false" })} />}
                {(search.minFee > 0 || search.maxFee < 5000000) && <Chip label={`Fee: ₹${search.minFee} - ₹${search.maxFee}`} onRemove={() => updateSearch({ minFee: 0, maxFee: 5000000 })} />}
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <span>{data?.count ?? 0} colleges found</span>
              <span>Page {search.page} of {Math.max(1, totalPages)}</span>
            </div>

            {/* Results */}
            {search.view === "grid" ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                {data?.colleges.map((c) => (
                  <CollegeCard key={c.id} college={c} saved={savedSlugs.has(c.slug)} onToggleSave={() => toggleSave(c.slug, c.name)} onShare={() => shareCollege(c.slug, c.name)} view="grid" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {data?.colleges.map((c) => (
                  <CollegeCard key={c.id} college={c} saved={savedSlugs.has(c.slug)} onToggleSave={() => toggleSave(c.slug, c.name)} onShare={() => shareCollege(c.slug, c.name)} view="list" />
                ))}
              </div>
            )}

            {/* Pagination */}
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

      {/* Mobile filter drawer */}
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

function CollegeCard({
  college,
  saved,
  onToggleSave,
  onShare,
  view,
}: {
  college: Awaited<ReturnType<typeof listColleges>>["colleges"][number];
  saved: boolean;
  onToggleSave: () => void;
  onShare: () => void;
  view: "grid" | "list";
}) {
  const feeDisplay = college.fees_min && college.fees_max
    ? `₹${(college.fees_min / 100000).toFixed(1)}L - ₹${(college.fees_max / 100000).toFixed(1)}L`
    : "Fees on request";

  const initials = college.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  if (view === "list") {
    return (
      <div className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-soft hover-lift flex flex-col sm:flex-row gap-4">
        <div className="shrink-0 grid h-16 w-16 place-items-center rounded-xl gradient-primary text-primary-foreground text-lg font-bold">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Link to="/colleges/$slug" params={{ slug: college.slug }} className="font-display text-lg font-bold hover:text-primary truncate block">
                {college.name}
              </Link>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground mt-1">
                <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {college.city}{college.state ? `, ${college.state}` : ""}</span>
                <span className="inline-flex items-center gap-1"><Building2 className="h-3.5 w-3.5" /> {college.type}</span>
                {college.hostel && <span className="inline-flex items-center gap-1"><Home className="h-3.5 w-3.5" /> Hostel</span>}
              </div>
            </div>
            {college.ranking && college.ranking <= 100 && (
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-semibold shrink-0">
                <Trophy className="h-3 w-3" /> Rank #{college.ranking}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {college.courses?.slice(0, 4).map((co) => (
              <span key={co} className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{co}</span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-3 mt-4 text-sm">
            <span className="font-semibold">{feeDisplay}</span>
            {college.placement_high && (
              <span className="text-muted-foreground">Highest: ₹{(college.placement_high / 100000).toFixed(1)}L</span>
            )}
          </div>
        </div>
        <div className="flex sm:flex-col gap-2 shrink-0">
          <button onClick={onToggleSave} className={`p-2 rounded-lg ${saved ? "text-rose-500 bg-rose-50" : "text-muted-foreground hover:bg-primary/5 hover:text-rose-500"}`} aria-label="Save">
            <Heart className={`h-5 w-5 ${saved ? "fill-current" : ""}`} />
          </button>
          <button onClick={onShare} className="p-2 rounded-lg text-muted-foreground hover:bg-primary/5 hover:text-primary" aria-label="Share">
            <Share2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft hover-lift flex flex-col">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl gradient-primary text-primary-foreground text-sm font-bold">
          {initials}
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
      <Link to="/colleges/$slug" params={{ slug: college.slug }} className="font-display text-base font-bold hover:text-primary line-clamp-2 min-h-[2.75rem]">
        {college.name}
      </Link>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-2">
        <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {college.city}</span>
        <span className="inline-flex items-center gap-1"><Building2 className="h-3 w-3" /> {college.type}</span>
      </div>
      <div className="flex flex-wrap gap-1.5 mt-3">
        {college.courses?.slice(0, 3).map((co) => (
          <span key={co} className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium">{co}</span>
        ))}
      </div>
      <div className="mt-auto pt-4 flex items-center justify-between text-sm">
        <span className="font-semibold">{feeDisplay}</span>
        {college.ranking && college.ranking <= 100 && (
          <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 font-semibold">
            <Trophy className="h-3 w-3" /> #{college.ranking}
          </span>
        )}
      </div>
    </div>
  );
}
