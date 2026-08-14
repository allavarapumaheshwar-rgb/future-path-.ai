import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "search_colleges",
  title: "Search colleges",
  description:
    "Search FuturePath AI's college directory (500+ Indian colleges) by name, state, city, type or course.",
  inputSchema: {
    query: z.string().trim().max(120).optional().describe("Text to match against college name or city."),
    state: z.string().trim().max(60).optional().describe("Indian state to filter by."),
    type: z.string().trim().max(40).optional().describe("College type, e.g. Government, Private, Deemed."),
    course: z.string().trim().max(60).optional().describe("Course offered, e.g. B.Tech, MBBS."),
    limit: z.number().int().min(1).max(25).default(10).describe("Maximum results to return."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, state, type, course, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseForUser(ctx);
    let q = supabase
      .from("colleges")
      .select("name,slug,city,state,type,ranking,fees_min,fees_max,courses,website")
      .order("ranking", { ascending: true, nullsFirst: false })
      .limit(limit ?? 10);
    if (query) q = q.or(`name.ilike.%${query}%,city.ilike.%${query}%`);
    if (state) q = q.ilike("state", `%${state}%`);
    if (type) q = q.ilike("type", `%${type}%`);
    if (course) q = q.contains("courses", [course]);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { colleges: data ?? [] },
    };
  },
});
