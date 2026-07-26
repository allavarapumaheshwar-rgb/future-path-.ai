import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { getScholarshipBySlug, toggleSavedScholarship, getSavedScholarshipSlugs } from "@/lib/scholarships.functions";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import {
  ArrowLeft, Building2, Calendar, CheckCircle2, FileText, Globe, Heart, Mail, MapPin,
  Share2, Users, GraduationCap, Clock, ArrowRight,
} from "lucide-react";
import { toast } from "sonner";

const scholarshipQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["scholarship", slug],
    queryFn: () => getScholarshipBySlug({ data: { slug } }),
  });

export const Route = createFileRoute("/scholarships/$slug")({
  loader: ({ params, context }) =>
    context.queryClient.ensureQueryData(scholarshipQueryOptions(params.slug)),
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — FuturePath AI Scholarships` },
      { name: "description", content: "Scholarship details, eligibility, benefits, documents and application information on FuturePath AI." },
      { property: "og:title", content: `${params.slug.replace(/-/g, " ")} — FuturePath AI Scholarships` },
      { property: "og:description", content: "Scholarship details, eligibility, benefits and application information." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ScholarshipDetailPage,
  errorComponent: ({ error }) => (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-16 text-center text-destructive">{error.message}</div>
    </Layout>
  ),
  notFoundComponent: () => (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">Scholarship not found.</div>
    </Layout>
  ),
});

function ScholarshipDetailPage() {
  const { slug } = Route.useParams();
  const { data: s } = useSuspenseQuery(scholarshipQueryOptions(slug));
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => setUser(session?.user ?? null));
    supabase.auth.getSession().then(({ data: d }) => setUser(d.session?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    getSavedScholarshipSlugs({ data: undefined }).then((slugs) => setSaved(slugs.includes(slug)));
  }, [user, slug]);

  const toggleSave = async () => {
    if (!user) {
      toast.info("Sign in to save scholarships");
      navigate({ to: "/auth", search: { mode: "login" } });
      return;
    }
    const result = await toggleSavedScholarship({ data: { slug, name: s.name, deadline: s.application_last } });
    setSaved(result.saved);
    toast.success(result.saved ? "Saved to tracker" : "Removed from tracker");
  };

  const share = () => {
    const url = `${window.location.origin}/scholarships/${slug}`;
    navigator.clipboard.writeText(url).then(() => toast.success("Scholarship link copied"));
  };

  const deadlineText = s.application_last
    ? new Date(s.application_last).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "Check official website";

  const startText = s.application_start
    ? new Date(s.application_start).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "Open";

  return (
    <Layout>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
        <Link to="/scholarships" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" /> Back to scholarships
        </Link>

        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-soft overflow-hidden">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <div className="shrink-0 grid h-20 w-20 sm:h-24 sm:w-24 place-items-center rounded-2xl bg-primary/10 text-primary text-2xl sm:text-3xl font-bold">
              {s.provider?.slice(0, 2).toUpperCase() || "SP"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold">{s.name}</h1>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-2">
                    <span className="inline-flex items-center gap-1"><Building2 className="h-4 w-4 text-primary" /> {s.provider}</span>
                    <span className="inline-flex items-center gap-1"><MapPin className="h-4 w-4 text-primary" /> {s.state || "All India"}</span>
                    <span className="inline-flex items-center gap-1"><GraduationCap className="h-4 w-4 text-primary" /> {s.level?.join(", ")}</span>
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

              <p className="mt-5 text-foreground/80 leading-relaxed">{s.description}</p>

              <div className="flex flex-wrap gap-2 mt-5">
                {s.category?.map((c) => (
                  <span key={c} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">{c}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <InfoCard icon={Calendar} label="Application Opens" value={startText} />
            <InfoCard icon={Clock} label="Last Date" value={deadlineText} />
            <InfoCard icon={Users} label="Eligibility" value={s.eligibility || "Refer website"} />
            <InfoCard icon={Building2} label="Provider Type" value={s.provider_type || "N/A"} />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <DetailSection title="Scholarship Benefits" icon={CheckCircle2}>
              <p className="text-foreground/80 leading-relaxed">{s.amount || "Please visit the official website for detailed benefit information."}</p>
              {s.amount && (
                <div className="mt-4 inline-flex items-center gap-2 text-lg font-bold text-primary px-4 py-2 rounded-xl bg-primary/10">
                  Award: {s.amount}
                </div>
              )}
            </DetailSection>

            <DetailSection title="Eligibility Criteria" icon={Users}>
              <p className="text-foreground/80 leading-relaxed">{s.eligibility || "Please check the official notification for complete eligibility details."}</p>
            </DetailSection>

            <DetailSection title="Required Documents" icon={FileText}>
              {s.documents?.length ? (
                <div className="grid sm:grid-cols-2 gap-3">
                  {s.documents.map((doc) => (
                    <div key={doc} className="flex items-start gap-2 text-sm text-foreground/80"><CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" /> {doc}</div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Documents list not available. Check official website.</p>
              )}
            </DetailSection>

            <DetailSection title="Selection Process" icon={CheckCircle2}>
              <p className="text-foreground/80 leading-relaxed">{s.selection_process || "Selection details will be available on the official website."}</p>
            </DetailSection>

            {s.faq && Array.isArray(s.faq) && s.faq.length > 0 && (
              <DetailSection title="Frequently Asked Questions" icon={Users}>
                <div className="space-y-4">
                  {(s.faq as { q?: string; a?: string }[]).map((item, idx) => (
                    <div key={idx}>
                      <div className="font-semibold text-foreground">{item.q}</div>
                      <div className="text-sm text-foreground/80 mt-1">{item.a}</div>
                    </div>
                  ))}
                </div>
              </DetailSection>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <h3 className="font-display font-bold text-lg mb-4">Apply Now</h3>
              <div className="space-y-3 text-sm">
                {s.apply_link && (
                  <a href={s.apply_link} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-primary hover:underline">
                    <ArrowRight className="h-4 w-4 shrink-0" /> Online application
                  </a>
                )}
                {s.website && (
                  <a href={s.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary">
                    <Globe className="h-4 w-4 shrink-0 text-muted-foreground" /> Official website
                  </a>
                )}
                {s.contact_details && (
                  <div className="flex items-start gap-2">
                    <Mail className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" /> {s.contact_details}
                  </div>
                )}
              </div>
              {s.apply_link && (
                <a href={s.apply_link} target="_blank" rel="noreferrer" className="mt-5 block w-full text-center px-4 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold hover:shadow-glow">
                  Apply for Scholarship
                </a>
              )}
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <h3 className="font-display font-bold text-lg mb-3">Important Dates</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Start Date</span><span className="font-medium">{startText}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Last Date</span><span className="font-medium">{deadlineText}</span></div>
              </div>
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
