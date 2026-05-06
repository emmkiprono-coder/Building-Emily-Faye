import type { Zone, Status, Priority } from "@/types/project";

export const LAUNCH_DATE = new Date("2026-07-04");

export const ZONES: Zone[] = [
  { id: "zone1", name: "Zone 1 — Bedroom", short: "Bedroom", color: "#C9824A" },
  { id: "zone2", name: "Zone 2 — Living Room", short: "Living Room", color: "#3F6B5C" },
  { id: "zone3", name: "Zone 3 — Kitchen", short: "Kitchen", color: "#A4324F" },
  { id: "zone4", name: "Zone 4 — Bathroom", short: "Bathroom", color: "#5B7BA8" },
  { id: "zone5", name: "Zone 5 — Cockpit", short: "Cockpit", color: "#8C6F3F" },
];

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

export const STORAGE_KEYS = {
  projects: "emily_faye_projects_v2",
  meta: "emily_faye_meta_v2",
  inventory: "emily_faye_inventory_v2",
} as const;
