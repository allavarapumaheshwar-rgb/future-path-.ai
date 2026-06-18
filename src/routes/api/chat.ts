import { createFileRoute } from "@tanstack/react-router";

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

type ChatMessage = { role: "user" | "assistant" | "system"; content: string };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as { messages?: ChatMessage[] };
        const messages = Array.isArray(body.messages) ? body.messages : [];
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Lovable-API-Key": key,
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
          }),
        });

        if (!res.ok) {
          const text = await res.text();
          const status = res.status === 429 ? 429 : res.status === 402 ? 402 : 500;
          return new Response(
            JSON.stringify({
              error:
                status === 429
                  ? "Too many requests. Please wait a moment and try again."
                  : status === 402
                  ? "AI credits exhausted. Please add credits to continue."
                  : "AI request failed. " + text.slice(0, 200),
            }),
            { status, headers: { "Content-Type": "application/json" } },
          );
        }
        const json = (await res.json()) as { choices?: { message?: { content?: string } }[] };
        const content = json.choices?.[0]?.message?.content ?? "Sorry, I couldn't generate a response.";
        return Response.json({ content });
      },
    },
  },
});
