"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AgenticPanel } from "@/components/AgenticPanel";
import { AlertStrip } from "@/components/AlertStrip";
import { BoardView } from "@/components/BoardView";
import { Dashboard } from "@/components/Dashboard";
import { Header, type SaveStatus, type ViewMode } from "@/components/Header";
import { InventoryView } from "@/components/InventoryView";
import { NewProjectModal } from "@/components/NewProjectModal";
import { ProjectDetail } from "@/components/ProjectDetail";
import { DEFAULT_BUDGETS, SEED_PROJECTS } from "@/data/seed";
import { STORAGE_KEYS } from "@/data/constants";
import {
  computeCompletionPrompts,
  computeDeadline,
  computeStale,
  computeStats,
} from "@/lib/compute";
import { readStorage, writeStorage } from "@/lib/storage";
import type {
  InventoryItem,
  Meta,
  Project,
  StatusId,
  ZoneId,
} from "@/types/project";

const DEFAULT_META: Meta = {
  budgetByZone: { ...DEFAULT_BUDGETS },
  weather: null,
  weatherFetchedAt: null,
};

export default function HomePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [meta, setMeta] = useState<Meta>(DEFAULT_META);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");

  const [activeZone, setActiveZone] = useState<ZoneId | "all">("all");
  const [activeStatus, setActiveStatus] = useState<StatusId | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showNewProject, setShowNewProject] = useState(false);
  const [view, setView] = useState<ViewMode>("board");
  const [showAgenticPanel, setShowAgenticPanel] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedProjects = readStorage<Project[]>(STORAGE_KEYS.projects);
      const storedMeta = readStorage<Meta>(STORAGE_KEYS.meta);
      const storedInventory = readStorage<InventoryItem[]>(
        STORAGE_KEYS.inventory
      );

      setProjects(
        Array.isArray(storedProjects) && storedProjects.length > 0
          ? storedProjects
          : SEED_PROJECTS
      );
      setMeta(storedMeta ?? DEFAULT_META);
      setInventory(Array.isArray(storedInventory) ? storedInventory : []);
    } catch (err) {
      console.error("Load failed:", err);
      setProjects(SEED_PROJECTS);
    } finally {
      setLoading(false);
    }
  }, []);

  // Persist projects with debounce
  useEffect(() => {
    if (loading) return;
    setSaveStatus("saving");
    const t = setTimeout(() => {
      const ok = writeStorage(STORAGE_KEYS.projects, projects);
      setSaveStatus(ok ? "saved" : "error");
      if (ok) setTimeout(() => setSaveStatus("idle"), 1500);
    }, 600);
    return () => clearTimeout(t);
  }, [projects, loading]);

  // Persist meta
  useEffect(() => {
    if (loading) return;
    const t = setTimeout(() => {
      writeStorage(STORAGE_KEYS.meta, meta);
    }, 400);
    return () => clearTimeout(t);
  }, [meta, loading]);

  // Persist inventory
  useEffect(() => {
    if (loading) return;
    const t = setTimeout(() => {
      writeStorage(STORAGE_KEYS.inventory, inventory);
    }, 400);
    return () => clearTimeout(t);
  }, [inventory, loading]);

  const updateProject = (id: string, updates: Partial<Project>) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, ...updates, updatedAt: new Date().toISOString() }
          : p
      )
    );
    if (selectedProject?.id === id) {
      setSelectedProject((sp) =>
        sp
          ? { ...sp, ...updates, updatedAt: new Date().toISOString() }
          : null
      );
    }
  };

  const deleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
    setSelectedProject(null);
  };

  const addProject = (zone: ZoneId, overrides: Partial<Project> = {}): Project => {
    const id = `p${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    const now = new Date().toISOString();
    const newP: Project = {
      id,
      zone,
      title: overrides.title || "New project",
      description: overrides.description || "",
      status: overrides.status || "planned",
      priority: overrides.priority || "medium",
      assignee: overrides.assignee || "",
      workCompleted: overrides.workCompleted || "",
      cost: overrides.cost || 0,
      estimatedCost: overrides.estimatedCost || 0,
      parts: overrides.parts || [],
      hoursSpent: overrides.hoursSpent || 0,
      estimatedHours: overrides.estimatedHours || 0,
      startDate: overrides.startDate || "",
      endDate: overrides.endDate || "",
      beforePhotos: overrides.beforePhotos || [],
      afterPhotos: overrides.afterPhotos || [],
      videos: overrides.videos || [],
      notes: overrides.notes || "",
      blockedBy: overrides.blockedBy || [],
      exteriorWork: overrides.exteriorWork || false,
      createdAt: now,
      updatedAt: now,
    };
    setProjects((prev) => [...prev, newP]);
    return newP;
  };

  const exportData = () => {
    const blob = new Blob(
      [JSON.stringify({ projects, meta, inventory }, null, 2)],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `emily_faye_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Computed values
  const filteredProjects = useMemo(
    () =>
      projects.filter((p) => {
        if (activeZone !== "all" && p.zone !== activeZone) return false;
        if (activeStatus !== "all" && p.status !== activeStatus) return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          if (
            !p.title.toLowerCase().includes(q) &&
            !p.description.toLowerCase().includes(q) &&
            !(p.assignee || "").toLowerCase().includes(q) &&
            !(p.notes || "").toLowerCase().includes(q)
          ) {
            return false;
          }
        }
        return true;
      }),
    [projects, activeZone, activeStatus, searchQuery]
  );

  const stats = useMemo(() => computeStats(projects, meta), [projects, meta]);
  const deadline = useMemo(() => computeDeadline(projects), [projects]);
  const staleProjects = useMemo(() => computeStale(projects), [projects]);
  const completionPrompts = useMemo(
    () => computeCompletionPrompts(projects),
    [projects]
  );

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0F1B2C" }}
      >
        <div className="flex items-center gap-3 text-parchment">
          <Loader2 size={18} className="spin" />
          <span className="font-mono text-sm">Hoisting the sails...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header
        saveStatus={saveStatus}
        view={view}
        setView={setView}
        onExport={exportData}
        onAgentic={() => setShowAgenticPanel(true)}
      />

      <AlertStrip
        completionPrompts={completionPrompts}
        staleProjects={staleProjects}
        onOpenProject={setSelectedProject}
        onMarkComplete={(id) => updateProject(id, { status: "complete" })}
      />

      {view === "board" && (
        <BoardView
          projects={filteredProjects}
          allProjects={projects}
          activeZone={activeZone}
          setActiveZone={setActiveZone}
          activeStatus={activeStatus}
          setActiveStatus={setActiveStatus}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSelect={setSelectedProject}
          onNewProject={() => setShowNewProject(true)}
          weather={meta.weather}
        />
      )}

      {view === "dashboard" && (
        <Dashboard
          stats={stats}
          deadline={deadline}
          meta={meta}
          setMeta={setMeta}
        />
      )}

      {view === "inventory" && (
        <InventoryView
          inventory={inventory}
          setInventory={setInventory}
          projects={projects}
        />
      )}

      {selectedProject && (
        <ProjectDetail
          project={selectedProject}
          allProjects={projects}
          onClose={() => setSelectedProject(null)}
          onUpdate={(updates) => updateProject(selectedProject.id, updates)}
          onDelete={() => deleteProject(selectedProject.id)}
          onAddProject={addProject}
        />
      )}

      {showNewProject && (
        <NewProjectModal
          onClose={() => setShowNewProject(false)}
          onSelect={(zone) => {
            const np = addProject(zone);
            setShowNewProject(false);
            setSelectedProject(np);
          }}
        />
      )}

      {showAgenticPanel && (
        <AgenticPanel
          onClose={() => setShowAgenticPanel(false)}
          projects={projects}
          stats={stats}
          deadline={deadline}
          meta={meta}
          setMeta={setMeta}
          updateProject={updateProject}
          setInventory={setInventory}
        />
      )}

      <footer
        className="text-center py-6 text-xs text-sand font-mono"
        style={{ borderTop: "1px solid rgba(196, 154, 80, 0.15)" }}
      >
        ⚓ TMarK Charters · Montrose Harbor · Target: July 4, 2026
      </footer>
    </div>
  );
}
