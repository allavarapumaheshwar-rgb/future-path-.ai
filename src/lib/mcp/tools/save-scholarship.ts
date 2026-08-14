import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "save_scholarship",
  title: "Save a scholarship",
  description: "Add a scholarship from the hub to the signed-in student's tracker.",
  inputSchema: {
    slug: z.string().trim().min(1).max(160).describe("Scholarship slug from search_scholarships."),
  },
  annotations: { readOnlyHint: false, idempotentHint: true, openWorldHint: false },
  handler: async ({ slug }, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseForUser(ctx);
    const { data: sch, error: findError } = await supabase
      .from("scholarships")
      .select("name,slug,application_last")
      .eq("slug", slug)
      .maybeSingle();
    if (findError) return { content: [{ type: "text", text: findError.message }], isError: true };
    if (!sch) return { content: [{ type: "text", text: `No scholarship found for slug "${slug}".` }], isError: true };

    const { data, error } = await supabase
      .from("saved_scholarships")
      .insert({
        user_id: ctx.getUserId()!,
        scholarship_name: sch.name,
        scholarship_slug: sch.slug,
        deadline: sch.application_last,
      })
      .select()
      .maybeSingle();
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    return { content: [{ type: "text", text: `Saved ${sch.name}.` }], structuredContent: { saved: data } };
  },
});
