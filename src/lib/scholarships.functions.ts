import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import type { Database } from "@/integrations/supabase/types";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const sel = (s: string): string => s;

function createPublicClient() {
  return createClient<Database>(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        storage: undefined,
      },
    },
  );
}

const listSchema = z.object({
  q: z.string().optional(),
  providerType: z.string().optional(),
  state: z.string().optional(),
  level: z.string().optional(),
  category: z.string().optional(),
  gender: z.string().optional(),
  stream: z.string().optional(),
  course: z.string().optional(),
  closingSoon: z.boolean().optional(),
  sort: z.string().optional(),
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
});

export const listScholarships = createServerFn({ method: "GET" })
  .inputValidator((data) => listSchema.parse(data))
  .handler(async ({ data }) => {
    const supabase = createPublicClient();
    let q = supabase.from("scholarships").select(sel("*"), { count: "exact" });

    if (data.q) {
      const term = data.q.trim();
      q = q.or(`name.ilike.%${term}%,provider.ilike.%${term}%,description.ilike.%${term}%`);
    }
    if (data.providerType) q = q.eq("provider_type", data.providerType);
    if (data.state) q = q.eq("state", data.state);
    if (data.level) q = q.contains("level", [data.level]);
    if (data.category) q = q.contains("category", [data.category]);
    if (data.gender) q = q.eq("gender", data.gender);
    if (data.stream) q = q.contains("stream", [data.stream]);
    if (data.course) q = q.contains("course", [data.course]);
    if (data.closingSoon) {
      const today = new Date().toISOString();
      const future = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      q = q.gte("application_last", today).lte("application_last", future);
    }

    const sort = data.sort || "last_date";
    if (sort === "last_date") q = q.order("application_last", { ascending: true });
    else if (sort === "name") q = q.order("name", { ascending: true });
    else if (sort === "newest") q = q.order("created_at", { ascending: false });
    else q = q.order("application_last", { ascending: true });

    const page = data.page || 1;
    const limit = data.limit || 24;
    q = q.range((page - 1) * limit, page * limit - 1);

    const { data: rows, error, count } = await q.returns<Database["public"]["Tables"]["scholarships"]["Row"][]>();
    if (error) throw error;
    return { scholarships: rows ?? [], count: count ?? 0, page, limit };
  });

const slugSchema = z.object({ slug: z.string().min(1) });

export const getScholarshipBySlug = createServerFn({ method: "GET" })
  .inputValidator((data) => slugSchema.parse(data))
  .handler(async ({ data }) => {
    const supabase = createPublicClient();
    const { data: row, error } = await supabase
      .from("scholarships")
      .select(sel("*"))
      .eq("slug", data.slug)
      .maybeSingle()
      .returns<Database["public"]["Tables"]["scholarships"]["Row"] | null>();
    if (error) throw error;
    if (!row) throw new Error("Scholarship not found");
    return row;
  });

export const getScholarshipFilters = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = createPublicClient();
  const { data: rows, error } = await supabase
    .from("scholarships")
    .select(sel("provider_type, state, level, category, gender, stream, course"))
    .returns<
      Pick<
        Database["public"]["Tables"]["scholarships"]["Row"],
        "provider_type" | "state" | "level" | "category" | "gender" | "stream" | "course"
      >[]
    >();
  if (error) throw error;

  const providerTypes = new Set<string>();
  const states = new Set<string>();
  const levels = new Set<string>();
  const categories = new Set<string>();
  const genders = new Set<string>();
  const streams = new Set<string>();
  const courses = new Set<string>();

  for (const r of rows ?? []) {
    if (r.provider_type) providerTypes.add(r.provider_type);
    if (r.state) states.add(r.state);
    if (r.gender) genders.add(r.gender);
    for (const l of r.level ?? []) levels.add(l);
    for (const c of r.category ?? []) categories.add(c);
    for (const s of r.stream ?? []) streams.add(s);
    for (const c of r.course ?? []) courses.add(c);
  }

  return {
    providerTypes: Array.from(providerTypes).sort(),
    states: Array.from(states).sort(),
    levels: Array.from(levels).sort(),
    categories: Array.from(categories).sort(),
    genders: Array.from(genders).sort(),
    streams: Array.from(streams).sort(),
    courses: Array.from(courses).sort(),
  };
});

const toggleSchema = z.object({ slug: z.string().min(1), name: z.string().min(1), deadline: z.string().nullable().optional() });

export const toggleSavedScholarship = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => toggleSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: existing } = await supabase
      .from("saved_scholarships")
      .select("id")
      .eq("user_id", userId)
      .eq("scholarship_slug", data.slug)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase.from("saved_scholarships").delete().eq("id", existing.id);
      if (error) throw error;
      return { saved: false };
    }

    const { error } = await supabase.from("saved_scholarships").insert({
      user_id: userId,
      scholarship_name: data.name,
      scholarship_slug: data.slug,
      deadline: data.deadline || null,
    });
    if (error) throw error;
    return { saved: true };
  });

export const getSavedScholarshipSlugs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("saved_scholarships")
      .select("scholarship_slug")
      .eq("user_id", userId)
      .not("scholarship_slug", "is", null)
      .returns<{ scholarship_slug: string }[]>();
    if (error) throw error;
    return (data ?? []).map((r) => r.scholarship_slug).filter(Boolean) as string[];
  });
