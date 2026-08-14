import { defineTool } from "@lovable.dev/mcp-js";
import { supabaseForUser } from "../supabase";

export default defineTool({
  name: "list_saved_items",
  title: "List saved items",
  description: "List the signed-in student's saved careers, colleges and scholarships.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async (_input, ctx) => {
    if (!ctx.isAuthenticated()) return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    const supabase = supabaseForUser(ctx);
    const [careers, colleges, scholarships] = await Promise.all([
      supabase.from("saved_careers").select("career_slug,created_at"),
      supabase.from("saved_colleges").select("college_name,college_slug,created_at"),
      supabase.from("saved_scholarships").select("scholarship_name,scholarship_slug,deadline,created_at"),
    ]);
    const error = careers.error ?? colleges.error ?? scholarships.error;
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const payload = {
      careers: careers.data ?? [],
      colleges: colleges.data ?? [],
      scholarships: scholarships.data ?? [],
    };
    return { content: [{ type: "text", text: JSON.stringify(payload) }], structuredContent: payload };
  },
});
