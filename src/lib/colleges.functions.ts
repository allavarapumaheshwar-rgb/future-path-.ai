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
  state: z.string().optional(),
  district: z.string().optional(),
  city: z.string().optional(),
  type: z.string().optional(),
  category: z.string().optional(),
  course: z.string().optional(),
  exam: z.string().optional(),
  minFee: z.preprocess((v) => (v === "" || v === undefined ? undefined : v), z.coerce.number().optional()),
  maxFee: z.preprocess((v) => (v === "" || v === undefined ? undefined : v), z.coerce.number().optional()),
  hostel: z.preprocess((v) => (v === "" || v === undefined ? undefined : v === true || v === "true"), z.boolean().optional()),
  sort: z.string().optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const listColleges = createServerFn({ method: "GET" })
  .inputValidator((data) => listSchema.parse(data))
  .handler(async ({ data }) => {
    const supabase = createPublicClient();
    let q = supabase.from("colleges").select(sel("*"), { count: "exact" });

    if (data.q) {
      const term = data.q.trim();
      q = q.or(`name.ilike.%${term}%,city.ilike.%${term}%,state.ilike.%${term}%`);
    }
    if (data.state) q = q.eq("state", data.state);
    if (data.district) q = q.eq("district", data.district);
    if (data.city) q = q.eq("city", data.city);
    if (data.type) q = q.eq("type", data.type);
    if (data.category) q = q.contains("category", [data.category]);
    if (data.course) q = q.contains("courses", [data.course]);
    if (data.exam) q = q.contains("entrance_exams", [data.exam]);
    if (data.minFee !== undefined) q = q.gte("fees_min", data.minFee);
    if (data.maxFee !== undefined) q = q.lte("fees_max", data.maxFee);
    if (data.hostel) q = q.eq("hostel", true);

    const sort = data.sort || "ranking";
    if (sort === "ranking") q = q.order("ranking", { ascending: true });
    else if (sort === "fees_asc") q = q.order("fees_min", { ascending: true });
    else if (sort === "fees_desc") q = q.order("fees_max", { ascending: false });
    else if (sort === "name") q = q.order("name", { ascending: true });
    else q = q.order("ranking", { ascending: true });

    const page = data.page || 1;
    const limit = data.limit || 24;
    q = q.range((page - 1) * limit, page * limit - 1);

    const { data: rows, error, count } = await q.returns<Database["public"]["Tables"]["colleges"]["Row"][]>();
    if (error) throw error;
    return { colleges: rows ?? [], count: count ?? 0, page, limit };
  });

const slugSchema = z.object({ slug: z.string().min(1) });

export const getCollegeBySlug = createServerFn({ method: "GET" })
  .inputValidator((data) => slugSchema.parse(data))
  .handler(async ({ data }) => {
    const supabase = createPublicClient();
    const { data: row, error } = await supabase
      .from("colleges")
      .select(sel("*"))
      .eq("slug", data.slug)
      .maybeSingle()
      .returns<Database["public"]["Tables"]["colleges"]["Row"] | null>();
    if (error) throw error;
    if (!row) throw new Error("College not found");
    return row;
  });

export const getCollegeFilters = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = createPublicClient();
  const { data: rows, error } = await supabase
    .from("colleges")
    .select(sel("state, type, category, courses, entrance_exams"))
    .returns<Pick<Database["public"]["Tables"]["colleges"]["Row"], "state" | "type" | "category" | "courses" | "entrance_exams">[]>();
  if (error) throw error;

  const states = new Set<string>();
  const types = new Set<string>();
  const categories = new Set<string>();
  const courses = new Set<string>();
  const exams = new Set<string>();

  for (const r of rows ?? []) {
    if (r.state) states.add(r.state);
    if (r.type) types.add(r.type);
    for (const c of r.category ?? []) categories.add(c);
    for (const c of r.courses ?? []) courses.add(c);
    for (const e of r.entrance_exams ?? []) exams.add(e);
  }

  return {
    states: Array.from(states).sort(),
    types: Array.from(types).sort(),
    categories: Array.from(categories).sort(),
    courses: Array.from(courses).sort(),
    exams: Array.from(exams).sort(),
  };
});

const toggleSchema = z.object({ slug: z.string().min(1), name: z.string().min(1) });

export const toggleSavedCollege = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => toggleSchema.parse(data))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { data: existing } = await supabase
      .from("saved_colleges")
      .select("id")
      .eq("user_id", userId)
      .eq("college_slug", data.slug)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase.from("saved_colleges").delete().eq("id", existing.id);
      if (error) throw error;
      return { saved: false };
    }

    const { error } = await supabase
      .from("saved_colleges")
      .insert({ user_id: userId, college_name: data.name, college_slug: data.slug });
    if (error) throw error;
    return { saved: true };
  });

export const getSavedCollegeSlugs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("saved_colleges")
      .select("college_slug")
      .eq("user_id", userId)
      .not("college_slug", "is", null)
      .returns<{ college_slug: string }[]>();
    if (error) throw error;
    return (data ?? []).map((r) => r.college_slug).filter(Boolean) as string[];
  });
