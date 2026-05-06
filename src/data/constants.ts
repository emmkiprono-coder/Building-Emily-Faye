import type { Status, Priority } from "@/types/project";

export const LAUNCH_DATE = new Date("2026-07-04");

export const STATUSES: Status[] = [
  { id: "planned", label: "Planned", color: "#6B7280" },
  { id: "in_progress", label: "In Progress", color: "#D97706" },
  { id: "blocked", label: "Blocked", color: "#DC2626" },
  { id: "complete", label: "Complete", color: "#059669" },
];

export const PRIORITIES: Priority[] = [
  { id: "low", label: "Low", color: "#6B7280" },
  { id: "medium", label: "Medium", color: "#D97706" },
  { id: "high", label: "High", color: "#DC2626" },
];

export const ZONE_COLOR_PALETTE = [
  "#C9824A",
  "#3F6B5C",
  "#A4324F",
  "#5B7BA8",
  "#8C6F3F",
  "#7A8B99",
  "#9C5A8E",
  "#5DBB97",
  "#D4AB60",
  "#A85C45",
] as const;

export const STORAGE_KEYS = {
  projects: "emily_faye_projects_v2",
  meta: "emily_faye_meta_v2",
  inventory: "emily_faye_inventory_v2",
  zones: "emily_faye_zones_v2",
} as const;
