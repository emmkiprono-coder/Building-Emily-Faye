import type { Project } from "@/types/project";

type SeedProject = Pick<
  Project,
  "id" | "zone" | "title" | "description" | "status" | "priority"
> & {
  exteriorWork?: boolean;
};

const RAW: SeedProject[] = [
  // Zone 1 - Bedroom
  { id: "b1", zone: "zone1", title: 'Close "V", use for closet', description: "Close off the V berth area and convert into closet storage", status: "planned", priority: "medium" },
  { id: "b2", zone: "zone1", title: "Cover ceiling, reroute draining pipe, hole in 5", description: "Ceiling cover work and drainage pipe rerouting", status: "planned", priority: "high" },
  { id: "b3", zone: "zone1", title: "Add strip light, LED and brick lighting", description: "Install LED strip and brick-style accent lighting", status: "planned", priority: "medium" },
  { id: "b4", zone: "zone1", title: "Finish wood work (sand, stain)", description: "Sand and stain all bedroom wood surfaces", status: "planned", priority: "medium" },
  { id: "b5", zone: "zone1", title: "Remove wall / add support beam", description: "Remove existing wall and install structural support beam", status: "planned", priority: "high" },
  { id: "b6", zone: "zone1", title: "Change windows", description: "Replace bedroom windows", status: "planned", priority: "medium" },
  { id: "b7", zone: "zone1", title: "Paint walls", description: "Paint all bedroom walls", status: "planned", priority: "low" },
  { id: "b8", zone: "zone1", title: "Plumbing to the back", description: "Run plumbing to the rear of the bedroom", status: "planned", priority: "high" },
  { id: "b9", zone: "zone1", title: "Add air flow outlets", description: "Install ventilation outlets for airflow", status: "planned", priority: "medium" },
  { id: "b10", zone: "zone1", title: "Extend the bedroom entrance door", description: "Extend bedroom entrance door for better access", status: "planned", priority: "medium" },

  // Zone 2 - Living Room
  { id: "l1", zone: "zone2", title: "Sand walls", description: "Sand all living room walls in prep for finishing", status: "planned", priority: "medium" },
  { id: "l2", zone: "zone2", title: "Remove wall cushions, throw away seat cushions", description: "Keep wall cushions (store them, bring down). Throw away seat cushions.", status: "planned", priority: "low" },
  { id: "l3", zone: "zone2", title: "Repair / patch holes in couch back", description: "Repair and patch all holes in couch back", status: "planned", priority: "medium" },
  { id: "l4", zone: "zone2", title: 'Create 2 couch cushion areas, 4" deep', description: "Build out two new couch cushion areas at 4 inch depth", status: "planned", priority: "medium" },
  { id: "l5", zone: "zone2", title: "Plumbing for toilet (under chair cushion, port side)", description: "Install toilet plumbing under chair cushion on port side", status: "planned", priority: "high" },
  { id: "l6", zone: "zone2", title: "Pole: remove rope for mast, rebuild base, buy new rope", description: "Mast pole work: remove old rope, rebuild base, install new rope", status: "planned", priority: "high" },
  { id: "l7", zone: "zone2", title: "Redo flooring, flat bilge clean, add new pump", description: "Redo living room flooring, clean bilge flat, install new bilge pump", status: "planned", priority: "high" },
  { id: "l8", zone: "zone2", title: "Add table (wood)", description: "Build and install wood table", status: "planned", priority: "low" },
  { id: "l9", zone: "zone2", title: "Refinish rails up top", description: "Refinish rails on upper deck", status: "planned", priority: "medium" },
  { id: "l10", zone: "zone2", title: "Ceiling repainted (white)", description: "Paint living room ceiling white", status: "planned", priority: "medium" },
  { id: "l11", zone: "zone2", title: "Add LED lighting or block", description: "Install LED lighting throughout living room", status: "planned", priority: "medium" },
  { id: "l12", zone: "zone2", title: "Add windows on side / clean existing", description: "Add new side windows, take existing to be cleaned and reinstall", status: "planned", priority: "medium" },
  { id: "l13", zone: "zone2", title: "Add solar fan", description: "Install solar-powered ventilation fan", status: "planned", priority: "medium" },
  { id: "l14", zone: "zone2", title: "Above couch cabinets, create electric box", description: "Build electric box housing above couch cabinets", status: "planned", priority: "medium" },
  { id: "l15", zone: "zone2", title: "Remove lamps", description: "Remove existing lamps", status: "planned", priority: "low" },
  { id: "l16", zone: "zone2", title: "Sand bottom of couch", description: "Sand the underside of the couch frame", status: "planned", priority: "low" },
  { id: "l17", zone: "zone2", title: "Add speakers", description: "Install audio speakers in living room", status: "planned", priority: "low" },
  { id: "l18", zone: "zone2", title: "Living room bed extension (next season)", description: "Deferred to next season: bed extension in living room", status: "planned", priority: "low" },

  // Zone 3 - Kitchen
  { id: "k1", zone: "zone3", title: "Cut the wood, create thin L shape", description: "Cut wood to form thin L-shape kitchen counter", status: "planned", priority: "high" },
  { id: "k2", zone: "zone3", title: "Demo full kitchen", description: "Demolish existing kitchen for rebuild", status: "planned", priority: "high" },
  { id: "k3", zone: "zone3", title: "Buy pull-out fridge, convection microwave", description: "Purchase pull-out fridge and convection microwave", status: "planned", priority: "high" },
  { id: "k4", zone: "zone3", title: "Layout: sink middle, microwave right, freezer left", description: "Create sink in center, microwave on right, freezer on left", status: "planned", priority: "high" },
  { id: "k5", zone: "zone3", title: "Put shutters on windows", description: "Install kitchen window shutters", status: "planned", priority: "low" },
  { id: "k6", zone: "zone3", title: "Create garbage area", description: "Build dedicated garbage storage area", status: "planned", priority: "medium" },
  { id: "k7", zone: "zone3", title: "Holding pole (assist getting down stairs into boat)", description: "Install holding pole to help with stair entry into the boat", status: "planned", priority: "medium" },
  { id: "k8", zone: "zone3", title: "Add TV to kitchen wall", description: "Mount TV on kitchen wall", status: "planned", priority: "low" },

  // Zone 4 - Bathroom
  { id: "ba1", zone: "zone4", title: "Build wood wall / door (accordion or sliding)", description: "Build wood wall with accordion or sliding door, plaster with fiberglass", status: "planned", priority: "high" },
  { id: "ba2", zone: "zone4", title: "Add a fan", description: "Install bathroom ventilation fan", status: "planned", priority: "medium" },
  { id: "ba3", zone: "zone4", title: "Toilet paper storage", description: "Build dedicated toilet paper storage", status: "planned", priority: "low" },
  { id: "ba4", zone: "zone4", title: "Add wall behind toilet / divide storage area", description: "Build wall behind toilet, divide storage area", status: "planned", priority: "medium" },
  { id: "ba5", zone: "zone4", title: "Repair staircase coming into boat", description: "Repair staircase entering the boat", status: "planned", priority: "high" },
  { id: "ba6", zone: "zone4", title: "Add mirror", description: "Install bathroom mirror", status: "planned", priority: "low" },

  // Zone 5 - Cockpit
  { id: "c1", zone: "zone5", title: "Clear companionway door (inside)", description: "Clear companionway door interior", status: "planned", priority: "medium" },
  { id: "c2", zone: "zone5", title: "Add screen to door / tinted glass (inside)", description: "Install screen door with tinted glass", status: "planned", priority: "medium" },
  { id: "c3", zone: "zone5", title: "Add cushions (outside)", description: "Install outdoor cockpit cushions", status: "planned", priority: "medium", exteriorWork: true },
  { id: "c4", zone: "zone5", title: "Finish wood (outside)", description: "Finish exterior wood surfaces in cockpit", status: "planned", priority: "medium", exteriorWork: true },
  { id: "c5", zone: "zone5", title: "Add outdoor flooring / rug", description: "Install outdoor flooring or rug in cockpit", status: "planned", priority: "low", exteriorWork: true },
  { id: "c6", zone: "zone5", title: "Polish hardware (silver)", description: "Polish all silver hardware in cockpit", status: "planned", priority: "low", exteriorWork: true },
  { id: "c7", zone: "zone5", title: "Add safety railings", description: "Install safety railings around cockpit", status: "planned", priority: "high", exteriorWork: true },
  { id: "c8", zone: "zone5", title: "Put sails up / replace the lines", description: "Raise sails and replace running lines", status: "planned", priority: "high", exteriorWork: true },
  { id: "c9", zone: "zone5", title: "Add navy blue cover over sails", description: "Install navy blue sail cover", status: "planned", priority: "medium", exteriorWork: true },
  { id: "c10", zone: "zone5", title: "Cut hole in security box for storage behind toilet", description: "Cut access hole in security box to reach storage behind toilet", status: "planned", priority: "medium" },
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
