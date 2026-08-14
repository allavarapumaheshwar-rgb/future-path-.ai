import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "save_career",
  title: "Save a career",
  description: "Bookmark a career (by its FuturePath AI slug, e.g. software-engineer) for the signed-in student.",
  inputSchema: {
    career_slug: z.string().trim().min(1).max(120).describe("Career slug as used on /careers/<slug>."),
  },
  annotations: { readOnlyHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ career_slug }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("saved_careers")
      .insert({ user_id: ctx.getUserId()!, career_slug })
      .select()
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return { content: [{ type: "text", text: `Saved career ${career_slug}.` }], structuredContent: { saved: data } };
  },
});
