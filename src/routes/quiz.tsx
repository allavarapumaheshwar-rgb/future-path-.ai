import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/Layout";
import { useState } from "react";
import { streams } from "@/lib/data";
import { Sparkles, ArrowRight, RefreshCw, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "AI Career Quiz — FuturePath AI" },
      { name: "description", content: "Take the 2-minute AI quiz to discover your ideal stream and careers." },
    ],
  }),
  component: QuizPage,
});

type StreamCode = "MPC" | "BiPC" | "CEC" | "MEC" | "Arts";

interface Question {
  q: string;
  options: { label: string; weights: Partial<Record<StreamCode, number>> }[];
}

const questions: Question[] = [
  { q: "Which subject do you enjoy most?", options: [
    { label: "Math & Physics", weights: { MPC: 3, MEC: 2 } },
    { label: "Biology & Chemistry", weights: { BiPC: 3 } },
    { label: "Business & Economics", weights: { CEC: 3, MEC: 2 } },
    { label: "History & Literature", weights: { Arts: 3 } },
  ]},
  { q: "How do you like to solve problems?", options: [
    { label: "Logic and equations", weights: { MPC: 3, MEC: 2 } },
    { label: "Observation and care for people", weights: { BiPC: 3, Arts: 1 } },
    { label: "Negotiation and numbers", weights: { CEC: 3, MEC: 2 } },
    { label: "Words and ideas", weights: { Arts: 3 } },
  ]},
  { q: "Your dream workplace looks like…", options: [
    { label: "A tech / research lab", weights: { MPC: 3, BiPC: 1 } },
    { label: "A hospital or healthcare setting", weights: { BiPC: 3 } },
    { label: "A bank, firm or startup office", weights: { CEC: 2, MEC: 3 } },
    { label: "A newsroom, court or government office", weights: { Arts: 3, CEC: 1 } },
  ]},
  { q: "Which superpower would you choose?", options: [
    { label: "Build any machine you imagine", weights: { MPC: 3 } },
    { label: "Heal any illness", weights: { BiPC: 3 } },
    { label: "Predict markets perfectly", weights: { MEC: 3, CEC: 1 } },
    { label: "Persuade anyone with words", weights: { Arts: 3, CEC: 1 } },
  ]},
  { q: "How important is money vs impact?", options: [
    { label: "Both — high salary + innovation", weights: { MPC: 2, MEC: 2 } },
    { label: "Service to society is everything", weights: { BiPC: 2, Arts: 2 } },
    { label: "Build wealth and businesses", weights: { CEC: 2, MEC: 2 } },
    { label: "Influence policy and culture", weights: { Arts: 3 } },
  ]},
];

function QuizPage() {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<StreamCode, number>>({ MPC: 0, BiPC: 0, CEC: 0, MEC: 0, Arts: 0 });
  const [done, setDone] = useState(false);

  function pick(weights: Partial<Record<StreamCode, number>>) {
    const next = { ...scores };
    (Object.keys(weights) as StreamCode[]).forEach((k) => { next[k] = (next[k] ?? 0) + (weights[k] ?? 0); });
    setScores(next);
    if (step + 1 >= questions.length) setDone(true);
    else setStep(step + 1);
  }

  function reset() { setScores({ MPC: 0, BiPC: 0, CEC: 0, MEC: 0, Arts: 0 }); setStep(0); setDone(false); }

  const ranked = (Object.entries(scores) as [StreamCode, number][]).sort((a, b) => b[1] - a[1]);
  const topCode = ranked[0]?.[0];
  const topStream = streams.find((s) => s.code === topCode);

  const progress = (step / questions.length) * 100;

  return (
    <Layout>
      <section className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4"><Sparkles className="h-3.5 w-3.5" /> AI Career Quiz</div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mb-3">Find your perfect stream</h1>
          <p className="text-muted-foreground">5 quick questions. Personalized recommendation in 2 minutes.</p>
        </div>

        {!done ? (
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-10 shadow-soft">
            <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
              <span>Question {step + 1} of {questions.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full mb-8 overflow-hidden">
              <div className="h-full gradient-primary transition-all" style={{ width: `${((step + 1) / questions.length) * 100}%` }} />
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold mb-6">{questions[step].q}</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {questions[step].options.map((o) => (
                <button key={o.label} onClick={() => pick(o.weights)}
                  className="group text-left p-4 rounded-xl border border-border bg-background hover:border-primary hover:bg-primary/5 transition-all">
                  <span className="text-sm font-medium">{o.label}</span>
                  <ArrowRight className="float-right h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-border bg-card p-8 sm:p-10 shadow-elegant text-center animate-fade-in">
            <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-primary" />
            <div className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Your match</div>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-2">{topStream?.code} — {topStream?.name.split(",")[0]}</h2>
            <p className="text-muted-foreground mb-6">{topStream?.tagline}</p>

            <div className="grid sm:grid-cols-5 gap-2 mb-8">
              {ranked.map(([code, val]) => {
                const max = Math.max(...ranked.map((r) => r[1])) || 1;
                const pct = (val / max) * 100;
                return (
                  <div key={code} className="rounded-xl bg-background border border-border p-3">
                    <div className="text-xs font-semibold mb-2">{code}</div>
                    <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className="h-full gradient-primary" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{val} pts</div>
                  </div>
                );
              })}
            </div>

            {topStream && (
              <div className="flex flex-wrap gap-2 justify-center mb-8">
                {topStream.careers.slice(0, 5).map((c) => <span key={c} className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">{c}</span>)}
              </div>
            )}

            <div className="flex flex-wrap gap-3 justify-center">
              {topStream && (
                <Link to="/streams/$slug" params={{ slug: topStream.slug }} className="px-6 py-3 rounded-xl gradient-primary text-primary-foreground font-semibold hover-lift">
                  Explore {topStream.code} →
                </Link>
              )}
              <button onClick={reset} className="px-6 py-3 rounded-xl border border-border bg-background font-semibold inline-flex items-center gap-2 hover-lift">
                <RefreshCw className="h-4 w-4" /> Retake
              </button>
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
}
