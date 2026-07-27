import { Check, Circle, Clock, Sparkles, Target } from "lucide-react";
import type { RoadmapStage } from "@/lib/roadmap";

interface Props {
  stages: RoadmapStage[];
  completed?: number[];
  onToggle?: (index: number) => void;
  compact?: boolean;
}

export function RoadmapTimeline({ stages, completed = [], onToggle, compact = false }: Props) {
  const done = new Set(completed);

  return (
    <ol className="relative space-y-4 sm:space-y-5">
      <span className="absolute left-4 top-2 bottom-2 w-px bg-border sm:left-5" aria-hidden />
      {stages.map((stage, i) => {
        const isDone = done.has(i);
        return (
          <li key={`${stage.title}-${i}`} className="relative pl-11 sm:pl-14">
            {onToggle ? (
              <button
                type="button"
                onClick={() => onToggle(i)}
                aria-pressed={isDone}
                aria-label={isDone ? `Mark "${stage.title}" as not done` : `Mark "${stage.title}" as done`}
                className={`absolute left-0 top-1 grid h-8 w-8 place-items-center rounded-full border-2 transition sm:h-10 sm:w-10 ${
                  isDone
                    ? "border-transparent gradient-primary text-primary-foreground shadow-glow"
                    : "border-border bg-background text-muted-foreground hover:border-primary hover:text-primary"
                }`}
              >
                {isDone ? <Check className="h-4 w-4" /> : <Circle className="h-3.5 w-3.5" />}
              </button>
            ) : (
              <span
                className={`absolute left-0 top-1 grid h-8 w-8 place-items-center rounded-full text-xs font-bold sm:h-10 sm:w-10 ${
                  isDone ? "gradient-primary text-primary-foreground" : "bg-primary/10 text-primary"
                }`}
              >
                {i + 1}
              </span>
            )}

            <div className={`rounded-2xl border border-border bg-card p-4 sm:p-5 ${isDone ? "opacity-80" : ""}`}>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {stage.phase}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                  <Clock className="h-3 w-3" /> {stage.duration}
                </span>
              </div>
              <h3 className={`font-display font-semibold text-base sm:text-lg ${isDone ? "line-through decoration-primary/50" : ""}`}>
                {stage.title}
              </h3>
              {!compact && stage.detail && (
                <p className="text-sm text-muted-foreground mt-1.5">{stage.detail}</p>
              )}

              {!compact && stage.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {stage.skills.map((s) => (
                    <span key={s} className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-accent text-accent-foreground font-medium">
                      <Sparkles className="h-3 w-3" /> {s}
                    </span>
                  ))}
                </div>
              )}

              {!compact && stage.milestones.length > 0 && (
                <ul className="mt-3 space-y-1.5">
                  {stage.milestones.map((m, mi) => (
                    <li key={mi} className="flex gap-2 text-sm text-foreground/80">
                      <Target className="h-3.5 w-3.5 shrink-0 mt-0.5 text-primary" />
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
