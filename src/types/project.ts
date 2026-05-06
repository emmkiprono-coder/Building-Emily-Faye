export type StatusId = "planned" | "in_progress" | "blocked" | "complete";
export type PriorityId = "low" | "medium" | "high";
export type ZoneId = string;

export interface MediaFile {
  id: string;
  name: string;
  dataUrl: string;
  size: number;
  type: string;
  uploadedAt: string;
}

export interface Part {
  id: number;
  name: string;
}

export interface Project {
  id: string;
  zone: ZoneId;
  title: string;
  description: string;
  status: StatusId;
  priority: PriorityId;
  assignee: string;
  workCompleted: string;
  cost: number;
  estimatedCost: number;
  parts: Part[];
  hoursSpent: number;
  estimatedHours: number;
  startDate: string;
  endDate: string;
  beforePhotos: MediaFile[];
  afterPhotos: MediaFile[];
  videos: MediaFile[];
  notes: string;
  blockedBy: string[];
  exteriorWork: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Zone {
  id: ZoneId;
  name: string;
  short: string;
  color: string;
}

export interface Status {
  id: StatusId;
  label: string;
  color: string;
}

export interface Priority {
  id: PriorityId;
  label: string;
  color: string;
}

export interface InventoryItem {
  id: number;
  name: string;
  qty: number;
  unit: string;
  addedAt: string;
}

export interface Weather {
  tempF: number;
  condition: string;
  windMph: number;
  precipChance: number;
  detailed: string;
  period: string;
  fetchedAt: string;
}

export interface Meta {
  budgetByZone: Record<string, number>;
  weather: Weather | null;
  weatherFetchedAt: string | null;
}
