import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

const SYSTEM_PROMPT = `You are "FuturePath AI Mentor" — a warm, encouraging career guidance counselor for Indian students from Class 10 through graduation.

You help with:
- Choosing streams: MPC, BiPC, CEC, MEC, Arts/Humanities
- Career pathways (engineering, medicine, civil services, business, design, arts, emerging tech)
- Course & college recommendations (Indian context — IITs, NITs, AIIMS, central universities, etc.)
- Skill development (coding, communication, leadership, critical thinking)
- Scholarships (NSP, Inspire, KVPY-equivalent, private)
- Government exams (UPSC, SSC, banking, state PSCs, NDA)
- Entrepreneurship guidance for students

Rules:
- Keep answers concise, structured, friendly. Use markdown: short paragraphs, **bold** key terms, bullet lists, and emoji sparingly.
- When recommending streams/careers, ask 1–2 clarifying questions if context is missing.
- Always end with a gentle next-step suggestion ("Want me to map a 3-year roadmap?").
- Be inclusive — never assume gender, background, or financial status.`;

const bodySchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().trim().min(1).max(4000),
      }),
    )
    .min(1)
    .max(30),
});

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;
        const key = process.env.LOVABLE_API_KEY;
        if (!supabaseUrl || !supabaseKey || !key) {
          return Response.json({ error: "Service unavailable." }, { status: 500 });
        }

        // Require a valid signed-in session before spending AI credits.
        const authHeader = request.headers.get("authorization") ?? "";
        if (!authHeader.startsWith("Bearer ")) {
          return Response.json({ error: "Please sign in to use the AI Mentor." }, { status: 401 });
        }
        const token = authHeader.slice("Bearer ".length).trim();
        if (!token) {
          return Response.json({ error: "Please sign in to use the AI Mentor." }, { status: 401 });
        }

        const supabase = createClient(supabaseUrl, supabaseKey, {
          auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
        });
        const { data: userData, error: authError } = await supabase.auth.getUser(token);
        if (authError || !userData?.user) {
          return Response.json({ error: "Please sign in to use the AI Mentor." }, { status: 401 });
        }

        let parsed;
        try {
          parsed = bodySchema.parse(await request.json());
        } catch {
          return Response.json({ error: "Invalid request." }, { status: 400 });
        }

        const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Lovable-API-Key": key,
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [{ role: "system", content: SYSTEM_PROMPT }, ...parsed.messages],
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
                    : "AI request failed. Please try again.",
            },
            { status },
          );
        }
        const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
        const content = json.choices?.[0]?.message?.content ?? "Sorry, I couldn't generate a response.";
        return Response.json({ content });
      },
    },
  },
});
