import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { getCollegeBySlug, toggleSavedCollege, getSavedCollegeSlugs } from "@/lib/colleges.functions";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import {
  MapPin, Building2, GraduationCap, Trophy, Home, Globe, Mail, Phone, Share2, Heart,
  ArrowLeft, CheckCircle2, Banknote, BookOpen, Users, Star,
} from "lucide-react";
import { toast } from "sonner";

const collegeQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["college", slug],
    queryFn: () => getCollegeBySlug({ data: { slug } }),
  });

export const Route = createFileRoute("/colleges/$slug")({
  loader: ({ params, context }) =>
    context.queryClient.ensureQueryData(collegeQueryOptions(params.slug)),
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — FuturePath AI College Finder` },
      { name: "description", content: "College details, courses, fees, placements and contact information on FuturePath AI." },
      { property: "og:title", content: `${params.slug.replace(/-/g, " ")} — FuturePath AI College Finder` },
      { property: "og:description", content: "College details, courses, fees, placements and contact information." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CollegeDetailPage,
  errorComponent: ({ error }) => (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-destructive">{error.message}</div>
    </Layout>
  ),
  notFoundComponent: () => (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">College not found.</div>
    </Layout>
  ),
});

function CollegeDetailPage() {
  const { slug } = Route.useParams();
  const { data: college } = useSuspenseQuery(collegeQueryOptions(slug));
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    supabase.auth.getSession().then(({ data: d }) => setUser(d.session?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    getSavedCollegeSlugs({ data: undefined }).then((slugs) => setSaved(slugs.includes(slug)));
  }, [user, slug]);

  const toggleSave = async () => {
    if (!user) {
      toast.info("Sign in to save colleges");
      navigate({ to: "/auth", search: { mode: "login" } });
      return;
    }
    const result = await toggleSavedCollege({ data: { slug, name: college.name } });
    setSaved(result.saved);
    toast.success(result.saved ? "Saved to wishlist" : "Removed from wishlist");
  };

  const share = () => {
    const url = `${window.location.origin}/colleges/${slug}`;
    navigator.clipboard.writeText(url).then(() => toast.success("College link copied"));
  };

  const initials = college.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase().slice(0, 2);
  const feeDisplay = college.fees_min && college.fees_max
    ? `₹${(college.fees_min / 100000).toFixed(1)}L - ₹${(college.fees_max / 100000).toFixed(1)}L / year`
    : "Fees on request";

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
        <Link to="/colleges" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to colleges
        </Link>

        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-soft overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <div className="shrink-0 grid h-20 w-20 sm:h-24 sm:w-24 place-items-center rounded-2xl gradient-primary text-primary-foreground text-2xl sm:text-3xl font-bold">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold">{college.name}</h1>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2">
                    <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4 text-primary" /> {college.city}{college.state ? `, ${college.state}` : ""}</span>
                    <span className="inline-flex items-center gap-1"><Building2 className="h-4 w-4 text-primary" /> {college.type}</span>
                    {college.hostel && <span className="inline-flex items-center gap-1"><Home className="h-4 w-4 text-primary" /> Hostel</span>}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={toggleSave} className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium ${saved ? "border-rose-200 bg-rose-50 text-rose-600" : "border-border hover:border-primary hover:text-primary"}`}>
                    <Heart className={`h-4 w-4 ${saved ? "fill-current" : ""}`} /> {saved ? "Saved" : "Save"}
                  </button>
                  <button onClick={share} className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-sm font-medium hover:border-primary hover:text-primary">
                    <Share2 className="h-4 w-4" /> Share
                  </button>
                </div>
              </div>

              {college.ranking && college.ranking <= 200 && (
                <div className="mt-4 inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-700 font-semibold">
                  <Trophy className="h-4 w-4" /> All India Rank #{college.ranking}
                </div>
              )}

              <p className="mt-5 text-foreground/80 leading-relaxed">{college.description}</p>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <InfoCard icon={Banknote} label="Fee Range" value={feeDisplay} />
            <InfoCard icon={GraduationCap} label="Eligibility" value={college.eligibility || "Refer website"} />
            <InfoCard icon={Star} label="Accreditation" value={college.accreditation || "N/A"} />
            <InfoCard icon={BookOpen} label="Entrance Exams" value={college.entrance_exams?.join(", ") || "N/A"} />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <DetailSection title="Courses Offered" icon={BookOpen}>
              <div className="flex flex-wrap gap-2">
                {college.courses?.map((c) => (
                  <span key={c} className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">{c}</span>
                ))}
              </div>
            </DetailSection>

            <DetailSection title="Facilities" icon={CheckCircle2}>
              <div className="grid sm:grid-cols-2 gap-3">
                {college.facilities?.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-foreground/80"><CheckCircle2 className="h-4 w-4 text-primary shrink-0" /> {f}</div>
                ))}
              </div>
            </DetailSection>

            <DetailSection title="Placement Highlights" icon={Users}>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-border bg-background p-4">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Highest Package</div>
                  <div className="text-2xl font-bold text-primary mt-1">{college.placement_high ? `₹${(college.placement_high / 100000).toFixed(1)}L` : "N/A"}</div>
                </div>
                <div className="rounded-2xl border border-border bg-background p-4">
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Average Package</div>
                  <div className="text-2xl font-bold text-primary mt-1">{college.placement_avg ? `₹${(college.placement_avg / 100000).toFixed(1)}L` : "N/A"}</div>
                </div>
              </div>
            </DetailSection>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <h3 className="font-display font-bold text-lg mb-4">Contact Details</h3>
              <div className="space-y-3 text-sm">
                {college.website && (
                  <a href={college.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                    <Globe className="h-4 w-4 shrink-0" /> Visit official website
                  </a>
                )}
                {college.email && (
                  <a href={`mailto:${college.email}`} className="flex items-center gap-2 hover:text-primary">
                    <Mail className="h-4 w-4 shrink-0 text-muted-foreground" /> {college.email}
                  </a>
                )}
                {college.phone && (
                  <a href={`tel:${college.phone}`} className="flex items-center gap-2 hover:text-primary">
                    <Phone className="h-4 w-4 shrink-0 text-muted-foreground" /> {college.phone}
                  </a>
                )}
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" /> {college.city}{college.district ? `, ${college.district}` : ""}{college.state ? `, ${college.state}` : ""}
                </div>
              </div>
              {college.website && (
                <a href={college.website} target="_blank" rel="noreferrer" className="mt-5 block w-full text-center px-4 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold hover:shadow-glow">
                  Visit Website
                </a>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <h3 className="font-display font-bold text-lg mb-3">Admission</h3>
              <p className="text-sm text-foreground/80 leading-relaxed">{college.admission_process || "Please check the official website for the latest admission process and important dates."}</p>
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
}

function InfoCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground mb-1">
        <Icon className="h-4 w-4 text-primary" /> {label}
      </div>
      <div className="font-semibold text-foreground line-clamp-2">{value}</div>
    </div>
  );
}

function DetailSection({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-soft">
      <h2 className="font-display text-xl font-bold mb-4 flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" /> {title}
      </h2>
      {children}
    </div>
  );
}
