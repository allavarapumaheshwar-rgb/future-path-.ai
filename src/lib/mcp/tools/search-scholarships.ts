import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "search_scholarships",
  title: "Search scholarships",
  description:
    "Search FuturePath AI's scholarship hub (1000+ Indian scholarships) by name, provider type, state, level or stream.",
  inputSchema: {
    query: z.string().trim().max(120).optional().describe("Text to match against scholarship or provider name."),
    provider_type: z.string().trim().max(40).optional().describe("Provider type, e.g. Government, Private, NGO."),
    state: z.string().trim().max(60).optional().describe("State the scholarship applies to."),
    level: z.string().trim().max(40).optional().describe("Education level, e.g. Class 10, UG, PG."),
    stream: z.string().trim().max(40).optional().describe("Stream, e.g. Engineering, Medical, Arts."),
    limit: z.number().int().min(1).max(25).default(10).describe("Maximum results to return."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ query, provider_type, state, level, stream, limit }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseForUser(ctx);
    let q = supabase
      .from("scholarships")
      .select("name,slug,provider,provider_type,amount,state,level,stream,application_last,apply_link")
      .eq("is_active", true)
      .limit(limit ?? 10);
    if (query) q = q.or(`name.ilike.%${query}%,provider.ilike.%${query}%`);
    if (provider_type) q = q.ilike("provider_type", `%${provider_type}%`);
    if (state) q = q.ilike("state", `%${state}%`);
    if (level) q = q.contains("level", [level]);
    if (stream) q = q.contains("stream", [stream]);
    const { data, error } = await q;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: JSON.stringify(data ?? []) }],
      structuredContent: { scholarships: data ?? [] },
    };
  },
});
