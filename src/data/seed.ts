import type { Project, Zone } from "@/types/project";

export const DEFAULT_ZONES: Zone[] = [
  { id: "zone1", name: "Zone 1: V-Berth (Bedroom)", short: "V-Berth", color: "#C9824A" },
  { id: "zone2", name: "Zone 2: Salon (Living Room)", short: "Salon", color: "#3F6B5C" },
  { id: "zone3", name: "Zone 3: Galley (Kitchen)", short: "Galley", color: "#A4324F" },
  { id: "zone4", name: "Zone 4: Head (Bathroom)", short: "Head", color: "#5B7BA8" },
  { id: "zone5", name: "Zone 5: Cockpit & Helm", short: "Cockpit", color: "#8C6F3F" },
];

type SeedProject = Pick<
  Project,
  "id" | "zone" | "title" | "description" | "status" | "priority"
> & {
  exteriorWork?: boolean;
};

const RAW: SeedProject[] = [
  // Zone 1: V-Berth (Bedroom)
  { id: "b1", zone: "zone1", title: 'Close off the V, use as hanging locker (closet)', description: "Close off the V-berth area and convert into a hanging locker (closet) for storage", status: "planned", priority: "medium" },
  { id: "b2", zone: "zone1", title: "Cover overhead (ceiling), reroute drain line, hole in 5", description: "Overhead (ceiling) cover work and drainage line rerouting", status: "planned", priority: "high" },
  { id: "b3", zone: "zone1", title: "Add LED strip lighting and accent lighting", description: "Install LED strip and brick-style accent lighting throughout the v-berth", status: "planned", priority: "medium" },
  { id: "b4", zone: "zone1", title: "Finish brightwork (sand, stain wood)", description: "Sand and stain all v-berth brightwork (interior wood surfaces)", status: "planned", priority: "medium" },
  { id: "b5", zone: "zone1", title: "Remove bulkhead (wall), add support beam", description: "Remove existing bulkhead (wall) and install structural support beam", status: "planned", priority: "high" },
  { id: "b6", zone: "zone1", title: "Replace portlights (windows)", description: "Replace v-berth portlights (windows)", status: "planned", priority: "medium" },
  { id: "b7", zone: "zone1", title: "Paint bulkheads (walls)", description: "Paint all v-berth bulkheads (walls)", status: "planned", priority: "low" },
  { id: "b8", zone: "zone1", title: "Run plumbing aft (toward stern)", description: "Run plumbing aft (toward the stern, the rear of the v-berth)", status: "planned", priority: "high" },
  { id: "b9", zone: "zone1", title: "Add ventilation outlets", description: "Install ventilation outlets for airflow through the v-berth", status: "planned", priority: "medium" },
  { id: "b10", zone: "zone1", title: "Extend the v-berth entry door", description: "Extend v-berth (bedroom) entrance door for better access", status: "planned", priority: "medium" },

  // Zone 2: Salon (Living Room)
  { id: "l1", zone: "zone2", title: "Sand bulkheads (walls)", description: "Sand all salon bulkheads (walls) in prep for finishing", status: "planned", priority: "medium" },
  { id: "l2", zone: "zone2", title: "Pull wall cushions, ditch settee cushions", description: "Keep wall cushions (store them, bring down). Throw away settee (couch) cushions.", status: "planned", priority: "low" },
  { id: "l3", zone: "zone2", title: "Repair holes in settee (couch) back", description: "Repair and patch all holes in settee (couch) back", status: "planned", priority: "medium" },
  { id: "l4", zone: "zone2", title: 'Build 2 settee cushion bays, 4" deep', description: "Build out two new settee (couch) cushion bays at 4 inch depth", status: "planned", priority: "medium" },
  { id: "l5", zone: "zone2", title: "Plumbing for head (toilet) under port settee cushion", description: "Install head (toilet) plumbing under chair cushion on port side (left)", status: "planned", priority: "high" },
  { id: "l6", zone: "zone2", title: "Mast: pull old halyard (rope), rebuild step, run new line", description: "Mast work: remove old halyard (rope), rebuild mast step (base), install new running rigging line", status: "planned", priority: "high" },
  { id: "l7", zone: "zone2", title: "Redo cabin sole (flooring), clean bilge, new bilge pump", description: "Redo salon cabin sole (flooring), clean bilge flat, install new bilge pump", status: "planned", priority: "high" },
  { id: "l8", zone: "zone2", title: "Build wood salon table", description: "Build and install wood salon table", status: "planned", priority: "low" },
  { id: "l9", zone: "zone2", title: "Refinish topside rails (deck handrails)", description: "Refinish handrails on topsides (upper deck)", status: "planned", priority: "medium" },
  { id: "l10", zone: "zone2", title: "Repaint overhead (ceiling) white", description: "Paint salon overhead (ceiling) white", status: "planned", priority: "medium" },
  { id: "l11", zone: "zone2", title: "Add LED lighting throughout salon", description: "Install LED lighting throughout the salon (living room)", status: "planned", priority: "medium" },
  { id: "l12", zone: "zone2", title: "Add side portlights, clean existing", description: "Add new side portlights (windows), take existing to be cleaned and reinstall", status: "planned", priority: "medium" },
  { id: "l13", zone: "zone2", title: "Install solar vent fan", description: "Install solar-powered ventilation fan", status: "planned", priority: "medium" },
  { id: "l14", zone: "zone2", title: "Build electrical panel above settee cabinets", description: "Build electrical panel housing above settee (couch) cabinets", status: "planned", priority: "medium" },
  { id: "l15", zone: "zone2", title: "Remove existing lamps", description: "Remove existing lamps from the salon", status: "planned", priority: "low" },
  { id: "l16", zone: "zone2", title: "Sand underside of settee frame", description: "Sand the underside of the settee (couch) frame", status: "planned", priority: "low" },
  { id: "l17", zone: "zone2", title: "Install audio speakers", description: "Install audio speakers in the salon", status: "planned", priority: "low" },
  { id: "l18", zone: "zone2", title: "Salon convertible berth (next season)", description: "Deferred to next season: convertible berth (bed) extension in the salon", status: "planned", priority: "low" },

  // Zone 3: Galley (Kitchen)
  { id: "k1", zone: "zone3", title: "Cut wood, build thin L-shape galley counter", description: "Cut wood to form thin L-shape galley (kitchen) counter", status: "planned", priority: "high" },
  { id: "k2", zone: "zone3", title: "Demo full galley", description: "Demolish existing galley (kitchen) for rebuild", status: "planned", priority: "high" },
  { id: "k3", zone: "zone3", title: "Buy pull-out fridge and convection microwave", description: "Purchase pull-out fridge and convection microwave for galley", status: "planned", priority: "high" },
  { id: "k4", zone: "zone3", title: "Galley layout: sink center, microwave starboard, freezer port", description: "Sink in center, microwave on starboard (right) side, freezer on port (left) side", status: "planned", priority: "high" },
  { id: "k5", zone: "zone3", title: "Install shutters on portlights (windows)", description: "Install galley portlight (window) shutters", status: "planned", priority: "low" },
  { id: "k6", zone: "zone3", title: "Build dedicated garbage bay", description: "Build dedicated garbage storage bay", status: "planned", priority: "medium" },
  { id: "k7", zone: "zone3", title: "Grab pole at companionway (stair entry)", description: "Install grab pole to assist climbing down the companionway (stairs into the boat)", status: "planned", priority: "medium" },
  { id: "k8", zone: "zone3", title: "Mount TV on galley bulkhead", description: "Mount TV on galley (kitchen) bulkhead (wall)", status: "planned", priority: "low" },

  // Zone 4: Head (Bathroom)
  { id: "ba1", zone: "zone4", title: "Build wood bulkhead and door (accordion or sliding)", description: "Build wood bulkhead (wall) with accordion or sliding door, plaster with fiberglass", status: "planned", priority: "high" },
  { id: "ba2", zone: "zone4", title: "Install head (bathroom) vent fan", description: "Install head (bathroom) ventilation fan", status: "planned", priority: "medium" },
  { id: "ba3", zone: "zone4", title: "Toilet paper storage", description: "Build dedicated toilet paper storage in the head", status: "planned", priority: "low" },
  { id: "ba4", zone: "zone4", title: "Add bulkhead behind head, divide storage", description: "Build bulkhead (wall) behind the head (toilet), divide storage area", status: "planned", priority: "medium" },
  { id: "ba5", zone: "zone4", title: "Repair companionway steps (stairs into boat)", description: "Repair companionway steps (staircase entering the boat)", status: "planned", priority: "high" },
  { id: "ba6", zone: "zone4", title: "Mount mirror", description: "Install head (bathroom) mirror", status: "planned", priority: "low" },

  // Zone 5: Cockpit & Helm
  { id: "c1", zone: "zone5", title: "Clear companionway hatch (interior side)", description: "Clear companionway hatch / door interior", status: "planned", priority: "medium" },
  { id: "c2", zone: "zone5", title: "Screen and tinted glass on companionway hatch", description: "Install screen and tinted glass on companionway hatch (interior)", status: "planned", priority: "medium" },
  { id: "c3", zone: "zone5", title: "Cockpit cushions (exterior)", description: "Install exterior cockpit cushions", status: "planned", priority: "medium", exteriorWork: true },
  { id: "c4", zone: "zone5", title: "Finish exterior brightwork (cockpit wood)", description: "Finish exterior brightwork (wood surfaces) in cockpit", status: "planned", priority: "medium", exteriorWork: true },
  { id: "c5", zone: "zone5", title: "Cockpit sole covering (outdoor flooring or rug)", description: "Install cockpit sole covering (outdoor flooring or rug)", status: "planned", priority: "low", exteriorWork: true },
  { id: "c6", zone: "zone5", title: "Polish hardware (stainless / silver fittings)", description: "Polish all stainless steel and silver-finish hardware in cockpit", status: "planned", priority: "low", exteriorWork: true },
  { id: "c7", zone: "zone5", title: "Install safety lifelines (railings)", description: "Install safety lifelines (railings) around cockpit", status: "planned", priority: "high", exteriorWork: true },
  { id: "c8", zone: "zone5", title: "Bend on sails, replace running rigging (lines)", description: "Raise (bend on) sails and replace running rigging (lines / ropes)", status: "planned", priority: "high", exteriorWork: true },
  { id: "c9", zone: "zone5", title: "Navy blue sail cover", description: "Install navy blue sail cover over the boom", status: "planned", priority: "medium", exteriorWork: true },
  { id: "c10", zone: "zone5", title: "Cut access in lazarette for storage behind head", description: "Cut access hole in lazarette (cockpit storage box) to reach storage behind the head", status: "planned", priority: "medium" },
];

const now = new Date().toISOString();

export const SEED_PROJECTS: Project[] = RAW.map((p) => ({
  ...p,
  assignee: "",
  workCompleted: "",
  cost: 0,
  estimatedCost: 0,
  parts: [],
  hoursSpent: 0,
  estimatedHours: 0,
  startDate: "",
  endDate: "",
  beforePhotos: [],
  afterPhotos: [],
  videos: [],
  notes: "",
  blockedBy: [],
  exteriorWork: p.exteriorWork ?? false,
  createdAt: now,
  updatedAt: now,
}));

export const DEFAULT_BUDGETS = {
  zone1: 3000,
  zone2: 4000,
  zone3: 5000,
  zone4: 2000,
  zone5: 3000,
} as const;
