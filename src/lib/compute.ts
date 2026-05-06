import type { Meta, Project, ZoneId } from "@/types/project";
import { LAUNCH_DATE, ZONES } from "@/data/constants";

export interface ZoneStats {
  id: ZoneId;
  name: string;
  short: string;
  color: string;
  total: number;
  complete: number;
  cost: number;
  hours: number;
  pct: number;
  budget: number;
  budgetPct: number;
  overBudget: boolean;
}

export interface OverallStats {
  total: number;
  complete: number;
  inProgress: number;
  blocked: number;
  totalCost: number;
  totalHours: number;
  totalBudget: number;
  byZone: ZoneStats[];
  pct: number;
}

export interface DeadlineInfo {
  daysRemaining: number;
  weeksRemaining: number;
  remaining: number;
  requiredVelocity: number;
  isUrgent: boolean;
  isCritical: boolean;
}

export function computeStats(projects: Project[], meta: Meta): OverallStats {
  const total = projects.length;
  const complete = projects.filter((p) => p.status === "complete").length;
  const inProgress = projects.filter((p) => p.status === "in_progress").length;
  const blocked = projects.filter((p) => p.status === "blocked").length;
  const totalCost = projects.reduce((s, p) => s + (Number(p.cost) || 0), 0);
  const totalHours = projects.reduce(
    (s, p) => s + (Number(p.hoursSpent) || 0),
    0
  );
  const totalBudget = Object.values(meta.budgetByZone).reduce(
    (s, v) => s + v,
    0
  );

  const byZone: ZoneStats[] = ZONES.map((z) => {
    const zp = projects.filter((p) => p.zone === z.id);
    const zc = zp.filter((p) => p.status === "complete").length;
    const zCost = zp.reduce((s, p) => s + (Number(p.cost) || 0), 0);
    const budget = meta.budgetByZone[z.id] ?? 0;
    return {
      id: z.id,
      name: z.name,
      short: z.short,
      color: z.color,
      total: zp.length,
      complete: zc,
      cost: zCost,
      hours: zp.reduce((s, p) => s + (Number(p.hoursSpent) || 0), 0),
      pct: zp.length ? Math.round((zc / zp.length) * 100) : 0,
      budget,
      budgetPct: budget ? Math.round((zCost / budget) * 100) : 0,
      overBudget: zCost > budget,
    };
  });

  return {
    total,
    complete,
    inProgress,
    blocked,
    totalCost,
    totalHours,
    totalBudget,
    byZone,
    pct: total ? Math.round((complete / total) * 100) : 0,
  };
}

export function computeDeadline(projects: Project[]): DeadlineInfo {
  const today = new Date();
  const msPerDay = 1000 * 60 * 60 * 24;
  const daysRemaining = Math.max(
    0,
    Math.ceil((LAUNCH_DATE.getTime() - today.getTime()) / msPerDay)
  );
  const remaining = projects.filter((p) => p.status !== "complete").length;
  const weeksRemaining = Math.max(0.1, daysRemaining / 7);
  const requiredVelocity = remaining / weeksRemaining;
  return {
    daysRemaining,
    weeksRemaining: Math.round(weeksRemaining * 10) / 10,
    remaining,
    requiredVelocity: Math.round(requiredVelocity * 10) / 10,
    isUrgent: daysRemaining < 30,
    isCritical: daysRemaining < 14,
  };
}

export function computeStale(projects: Project[]): Project[] {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return projects.filter(
    (p) =>
      p.status === "in_progress" &&
      new Date(p.updatedAt).getTime() < sevenDaysAgo
  );
}

export function computeCompletionPrompts(projects: Project[]): Project[] {
  return projects.filter(
    (p) =>
      p.status !== "complete" &&
      p.afterPhotos.length > 0 &&
      (p.workCompleted || "").trim().length > 20
  );
}
