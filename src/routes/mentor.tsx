import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Layout } from "@/components/Layout";
import { Send, Sparkles, Bot, User, RotateCcw, Loader2, Lightbulb } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

export const Route = createFileRoute("/mentor")({
  head: () => ({
    meta: [
      { title: "AI Career Mentor — FuturePath AI" },
      { name: "description", content: "Chat with FuturePath AI Mentor for personalised career, stream, college and skill guidance." },
    ],
  }),
  component: MentorPage,
});

type Msg = { role: "user" | "assistant"; content: string };
const STORAGE = "fp_mentor_history_v1";

const SUGGESTED = [
  "Which stream is best for me after Class 10?",
  "What careers are available after MPC?",
  "How can I become an IAS officer?",
  "Which skills should I learn for Artificial Intelligence?",
  "What courses are available after BiPC?",
  "Suggest scholarships for engineering students.",
];

const QUICK_ACTIONS = [
  { icon: "🎯", label: "Stream Recommendation", prompt: "Help me choose between MPC, BiPC, CEC, MEC and Arts. I'm in Class 10. Ask me what I need to decide." },
  { icon: "💼", label: "Career Pathway", prompt: "Give me a step-by-step 5-year career pathway for becoming a software engineer in India." },
  { icon: "🏛️", label: "Govt. Exam Plan", prompt: "Create a 12-month UPSC preparation roadmap for a beginner." },
  { icon: "🚀", label: "Start a Business", prompt: "I'm 19 and want to start a student-focused startup. Walk me through the first 90 days." },
];

function MentorPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) setMessages(JSON.parse(raw));
    } catch { /* ignore */ }
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem(STORAGE, JSON.stringify(messages));
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || loading) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to get response");
        setMessages(next);
      } else {
        setMessages([...next, { role: "assistant", content: data.content }]);
      }
    } catch (e) {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  function reset() {
    setMessages([]);
    localStorage.removeItem(STORAGE);
    inputRef.current?.focus();
  }

  const empty = messages.length === 0;

  return (
    <Layout>
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-6">
        <div className="rounded-3xl border border-border bg-card shadow-soft overflow-hidden flex flex-col h-[calc(100vh-8rem)]">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-gradient-to-r from-primary/5 to-transparent">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl gradient-primary shadow-glow">
                <Sparkles className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-display text-lg font-bold">FuturePath AI Mentor</h1>
                <p className="text-xs text-muted-foreground">Personalised guidance · Powered by Lovable AI</p>
              </div>
            </div>
            {messages.length > 0 && (
              <button onClick={reset} className="text-xs inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:bg-muted">
                <RotateCcw className="h-3.5 w-3.5" /> New chat
              </button>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-5">
            {empty ? (
              <div className="max-w-2xl mx-auto text-center py-8 space-y-6">
                <div className="grid h-16 w-16 mx-auto place-items-center rounded-2xl gradient-primary shadow-glow animate-float">
                  <Bot className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-bold">Hi, I'm your AI Career Mentor 👋</h2>
                  <p className="text-muted-foreground mt-2">Ask me anything about streams, careers, colleges, scholarships, skills, government exams or entrepreneurship.</p>
                </div>

                <div className="grid sm:grid-cols-2 gap-3 text-left">
                  {QUICK_ACTIONS.map((q) => (
                    <button key={q.label} onClick={() => send(q.prompt)} className="p-4 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition text-left">
                      <div className="text-2xl mb-1">{q.icon}</div>
                      <p className="font-semibold text-sm">{q.label}</p>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{q.prompt}</p>
                    </button>
                  ))}
                </div>

                <div className="text-left">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 mb-2">
                    <Lightbulb className="h-3 w-3" /> Suggested questions
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTED.map((s) => (
                      <button key={s} onClick={() => send(s)} className="px-3 py-1.5 rounded-full border border-border text-xs hover:border-primary hover:text-primary transition">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
                  {m.role === "assistant" && (
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg gradient-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                    m.role === "user"
                      ? "gradient-primary text-primary-foreground rounded-tr-sm"
                      : "bg-muted text-foreground rounded-tl-sm"
                  }`}>
                    {m.role === "assistant" ? (
                      <div className="prose prose-sm max-w-none prose-p:my-1.5 prose-ul:my-1.5 prose-headings:font-display">
                        <ReactMarkdown>{m.content}</ReactMarkdown>
                      </div>
                    ) : (
                      <p className="whitespace-pre-wrap">{m.content}</p>
                    )}
                  </div>
                  {m.role === "user" && (
                    <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-foreground/10">
                      <User className="h-4 w-4" />
                    </div>
                  )}
                </div>
              ))
            )}
            {loading && (
              <div className="flex gap-3">
                <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg gradient-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-muted-foreground inline-flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking…
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Composer */}
          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="border-t border-border p-3 sm:p-4 bg-background"
          >
            <div className="flex items-end gap-2 p-2 rounded-2xl border border-input bg-card focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
                }}
                placeholder="Ask about streams, careers, colleges, scholarships…"
                rows={1}
                className="flex-1 resize-none bg-transparent px-2 py-2 text-sm focus:outline-none max-h-32"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="grid h-9 w-9 place-items-center rounded-xl gradient-primary text-primary-foreground disabled:opacity-40 hover-lift"
                aria-label="Send"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground mt-2 text-center">AI Mentor can make mistakes. Verify critical information independently.</p>
          </form>
        </div>
      </section>
    </Layout>
  );
}
