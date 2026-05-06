"use client";

import { Anchor, CloudRain, Plus, Search, Sun } from "lucide-react";
import type { Project, StatusId, Weather, Zone, ZoneId } from "@/types/project";
import { STATUSES } from "@/data/constants";
import { FilterChip } from "./primitives";
import { ProjectCard } from "./ProjectCard";

interface BoardViewProps {
  projects: Project[];
  allProjects: Project[];
  zones: Zone[];
  activeZone: ZoneId | "all";
  setActiveZone: (z: ZoneId | "all") => void;
  activeStatus: StatusId | "all";
  setActiveStatus: (s: StatusId | "all") => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onSelect: (p: Project) => void;
  onNewProject: () => void;
  weather: Weather | null;
}

function WeatherBanner({ weather }: { weather: Weather | null }) {
  if (!weather) return null;
  const isGood =
    weather.precipChance < 30 && weather.tempF > 45 && weather.windMph < 20;
  return (
    <div
      className="rounded-lg p-3 mb-4 flex items-center gap-3 flex-wrap"
      style={{
        background: isGood
          ? "rgba(93, 187, 151, 0.08)"
          : "rgba(91, 123, 168, 0.08)",
        border: `1px solid ${
          isGood ? "rgba(93, 187, 151, 0.3)" : "rgba(91, 123, 168, 0.3)"
        }`,
      }}
    >
      {isGood ? (
        <Sun size={18} style={{ color: "#5DBB97", flexShrink: 0 }} />
      ) : (
        <CloudRain size={18} style={{ color: "#5B7BA8", flexShrink: 0 }} />
      )}
      <span className="text-sm flex-1 text-parchment">
        <span className="font-semibold">
          {weather.tempF}°F · {weather.condition}
        </span>
        <span className="text-sand">
          {" "}
          · {weather.windMph} mph wind · {weather.precipChance}% precip
        </span>
      </span>
      <span
        className="text-xs px-2 py-1 rounded font-medium font-mono"
        style={{
          background: isGood
            ? "rgba(93, 187, 151, 0.15)"
            : "rgba(91, 123, 168, 0.15)",
          color: isGood ? "#5DBB97" : "#5B7BA8",
        }}
      >
        {isGood ? "GOOD FOR TOPSIDE WORK" : "BELOW-DECKS WORK ADVISED"}
      </span>
    </div>
  );
}

export function BoardView({
  projects,
  allProjects,
  zones,
  activeZone,
  setActiveZone,
  activeStatus,
  setActiveStatus,
  searchQuery,
  setSearchQuery,
  onSelect,
  onNewProject,
  weather,
}: BoardViewProps) {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {weather && <WeatherBanner weather={weather} />}

      <div className="mb-6 space-y-3">
        <div className="relative">
          <Search
            size={16}
            className="absolute top-1/2 -translate-y-1/2 left-3 text-sand"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, assignees, notes..."
            className="w-full pl-10 pr-3 py-2.5 rounded-lg text-sm input-field"
            aria-label="Search"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <FilterChip
            active={activeZone === "all"}
            onClick={() => setActiveZone("all")}
          >
            All Zones
          </FilterChip>
          {zones.map((z) => (
            <FilterChip
              key={z.id}
              active={activeZone === z.id}
              onClick={() => setActiveZone(z.id)}
              color={z.color}
            >
              {z.short}
            </FilterChip>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          <FilterChip
            active={activeStatus === "all"}
            onClick={() => setActiveStatus("all")}
          >
            All Statuses
          </FilterChip>
          {STATUSES.map((s) => (
            <FilterChip
              key={s.id}
              active={activeStatus === s.id}
              onClick={() => setActiveStatus(s.id)}
              color={s.color}
            >
              {s.label}
            </FilterChip>
          ))}
        </div>
      </div>

      <div
        className="grid gap-3"
        style={{
          gridTemplateColumns:
            "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
        }}
      >
        {projects.map((p) => (
          <ProjectCard
            key={p.id}
            project={p}
            allProjects={allProjects}
            zones={zones}
            onClick={() => onSelect(p)}
            weather={weather}
          />
        ))}
        {projects.length === 0 && (
          <div className="col-span-full text-center py-12 text-sand">
            <Anchor size={48} className="mx-auto mb-3 opacity-30" />
            <p>No projects match your filters.</p>
          </div>
        )}
      </div>

      <button
        onClick={onNewProject}
        className="brass-button fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg z-30"
        style={{ boxShadow: "0 6px 20px rgba(196, 154, 80, 0.4)" }}
        aria-label="Add new project"
      >
        <Plus size={24} />
      </button>
    </main>
  );
}
