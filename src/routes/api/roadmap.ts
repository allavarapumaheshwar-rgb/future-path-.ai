import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const bodySchema = z.object({
  career: z.string().trim().min(2).max(120),
  context: z.string().trim().max(500).optional(),
});

const SYSTEM_PROMPT = `You are FuturePath AI's career roadmap generator for Indian students.
Return ONLY valid JSON (no markdown fences) shaped exactly like:
{"title":"<Career> Roadmap","stages":[{"title":"...","phase":"...","duration":"...","detail":"...","skills":["..."],"milestones":["..."]}]}
Rules:
- 5 to 7 stages, ordered from school/college foundation to long-term mastery.
- "phase" is a short label (Foundation, Qualification, Experience, Growth, Mastery).
- "duration" is a time window such as "Year 1" or "Years 3-5".
- "detail" is 1-2 sentences, practical and specific to the Indian education system (boards, entrance exams, degrees, internships).
- "skills" 2-4 items, "milestones" 2-4 concrete, checkable actions.
- Never include commentary outside the JSON object.`;

export const Route = createFileRoute("/api/roadmap")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;
        const key = process.env.LOVABLE_API_KEY;
        if (!supabaseUrl || !supabaseKey || !key) {
          return Response.json({ error: "Service unavailable." }, { status: 500 });
        }

        const authHeader = request.headers.get("authorization") ?? "";
        const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7).trim() : "";
        if (!token) {
          return Response.json({ error: "Please sign in to generate a roadmap." }, { status: 401 });
        }
        const supabase = createClient(supabaseUrl, supabaseKey, {
          auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
        });
        const { data: userData, error: authError } = await supabase.auth.getUser(token);
        if (authError || !userData?.user) {
          return Response.json({ error: "Please sign in to generate a roadmap." }, { status: 401 });
        }

        let parsed;
        try {
          parsed = bodySchema.parse(await request.json());
        } catch {
          return Response.json({ error: "Invalid request." }, { status: 400 });
        }

        const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Lovable-API-Key": key },
          body: JSON.stringify({
            model: "google/gemini-3.6-flash",
            response_format: { type: "json_object" },
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              {
                role: "user",
                content: `Career goal: ${parsed.career}${parsed.context ? `\nStudent context: ${parsed.context}` : ""}`,
              },
            ],
          }),
        });

        if (!res.ok) {
          const status = res.status === 429 ? 429 : res.status === 402 ? 402 : 500;
          return Response.json(
            {
              error:
                status === 429
                  ? "Too many requests. Please wait a moment and try again."
                  : status === 402
                    ? "AI credits exhausted. Please add credits to continue."
                    : "Could not generate the roadmap. Please try again.",
            },
            { status },
          );
        }

        const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
        const raw = json.choices?.[0]?.message?.content ?? "";
        const cleaned = raw.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();

        try {
          const roadmap = JSON.parse(cleaned) as {
            title?: string;
            stages?: unknown[];
          };
          const stages = (Array.isArray(roadmap.stages) ? roadmap.stages : []).map((s) => {
            const stage = s as Record<string, unknown>;
            return {
              title: String(stage.title ?? "Stage"),
              phase: String(stage.phase ?? "Stage"),
              duration: String(stage.duration ?? ""),
              detail: String(stage.detail ?? ""),
              skills: Array.isArray(stage.skills) ? stage.skills.map(String).slice(0, 6) : [],
              milestones: Array.isArray(stage.milestones) ? stage.milestones.map(String).slice(0, 6) : [],
            };
          });
          if (stages.length === 0) throw new Error("empty");
          return Response.json({ title: String(roadmap.title ?? `${parsed.career} Roadmap`), stages });
        } catch {
          return Response.json({ error: "The AI returned an unexpected format. Please try again." }, { status: 502 });
        }
      },
    },
  },
});
