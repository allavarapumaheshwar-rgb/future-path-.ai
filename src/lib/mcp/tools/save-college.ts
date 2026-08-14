import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "save_college",
  title: "Save a college",
  description: "Add a college from the directory to the signed-in student's saved list.",
  inputSchema: {
    slug: z.string().trim().min(1).max(160).describe("College slug from search_colleges."),
  },
  annotations: { readOnlyHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ slug }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseForUser(ctx);
    const { data: college, error: findError } = await supabase
      .from("colleges")
      .select("name,slug")
      .eq("slug", slug)
      .maybeSingle();
    if (findError) return { content: [{ type: "text", text: findError.message }], isError: true };
    if (!college) return { content: [{ type: "text", text: `No college found for slug "${slug}".` }], isError: true };

    const { data, error } = await supabase
      .from("saved_colleges")
      .insert({ user_id: ctx.getUserId()!, college_name: college.name, college_slug: college.slug })
      .select()
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return {
      content: [{ type: "text", text: `Saved ${college.name}.` }],
      structuredContent: { saved: data },
    };
  },
});
