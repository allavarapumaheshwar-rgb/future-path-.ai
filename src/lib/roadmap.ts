import { careers, type Career } from "@/lib/data";

export interface RoadmapStage {
  title: string;
  phase: string;
  duration: string;
  detail: string;
  skills: string[];
  milestones: string[];
}

export interface Roadmap {
  careerSlug: string | null;
  title: string;
  source: "curated" | "ai";
  stages: RoadmapStage[];
}

const PHASES = ["Foundation", "Qualification", "Experience", "Growth", "Mastery"];

const DURATIONS = ["Year 1", "Years 1–3", "Years 3–5", "Years 5–8", "Years 8+"];

function chunk<T>(items: T[], parts: number, index: number): T[] {
  if (items.length === 0) return [];
  const size = Math.max(1, Math.ceil(items.length / parts));
  return items.slice(index * size, index * size + size);
}

/**
 * Turns the compact roadmap strings stored on a career into a richer,
 * stage-by-stage timeline (phase, duration, focus skills and milestones).
 */
export function buildCareerRoadmap(career: Career): Roadmap {
  const total = career.roadmap.length;
  const stages: RoadmapStage[] = career.roadmap.map((step, i) => {
    const phase = PHASES[Math.min(i, PHASES.length - 1)];
    const duration = DURATIONS[Math.min(i, DURATIONS.length - 1)];
    const skills = chunk(career.skills, total, i);
    const courses = chunk(career.courses, total, i);

    const milestones: string[] = [];
    if (i === 0) milestones.push(`Eligibility: ${career.eligibility}`);
    if (courses.length) milestones.push(`Courses to target: ${courses.join(", ")}`);
    if (skills.length) milestones.push(`Build proof of work in ${skills[0]}`);
    if (i === total - 1) milestones.push(career.growth);

    return {
      title: step,
      phase,
      duration,
      detail:
        i === 0
          ? `Start here. ${career.overview}`
          : i === total - 1
            ? `Long-term positioning. ${career.futureDemand}`
            : `Focus on turning study into demonstrable experience for a ${career.title.toLowerCase()} track.`,
      skills,
      milestones,
    };
  });

  return {
    careerSlug: career.slug,
    title: `${career.title} Roadmap`,
    source: "curated",
    stages,
  };
}

export function getRoadmapBySlug(slug: string): Roadmap | null {
  const career = careers.find((c) => c.slug === slug);
  return career ? buildCareerRoadmap(career) : null;
}

export function progressPercent(stages: RoadmapStage[], completed: number[]): number {
  if (stages.length === 0) return 0;
  const valid = completed.filter((i) => i >= 0 && i < stages.length);
  return Math.round((new Set(valid).size / stages.length) * 100);
}
