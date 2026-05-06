"use client";

import {
  CheckCircle2,
  Circle,
  Clock,
  CloudRain,
  DollarSign,
  Image as ImageIcon,
  Link2,
  Sun,
  User,
} from "lucide-react";
import type { Project, Weather } from "@/types/project";
import { PRIORITIES, STATUSES, ZONES } from "@/data/constants";

interface ProjectCardProps {
  project: Project;
  allProjects: Project[];
  onClick: () => void;
  weather?: Weather | null;
}

export function ProjectCard({
  project,
  allProjects,
  onClick,
  weather,
}: ProjectCardProps) {
  const zone = ZONES.find((z) => z.id === project.zone)!;
  const status = STATUSES.find((s) => s.id === project.status)!;
  const priority = PRIORITIES.find((p) => p.id === project.priority)!;
  const blockers = (project.blockedBy || [])
    .map((id) => allProjects.find((p) => p.id === id))
    .filter((p): p is Project => Boolean(p));
  const hasUnmetBlockers = blockers.some((b) => b.status !== "complete");
  const isExteriorPlanned = project.exteriorWork && project.status === "planned";
  const weatherGood =
    weather &&
    weather.precipChance < 30 &&
    weather.tempF > 45 &&
    weather.windMph < 20;

  return (
    <button
      onClick={onClick}
      className="nautical-card rounded-lg p-4 text-left transition-all fade-in flex flex-col"
      style={{ minHeight: "140px" }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span
          className="text-xs px-2 py-0.5 rounded font-medium font-mono tracking-[0.05em]"
          style={{ background: `${zone.color}30`, color: zone.color }}
        >
          {zone.short}
        </span>
        <span
          className="text-xs flex items-center gap-1"
          style={{ color: status.color }}
        >
          {project.status === "complete" ? (
            <CheckCircle2 size={14} />
          ) : (
            <Circle size={14} />
          )}
          {status.label}
        </span>
      </div>

      <h3 className="text-[0.95rem] font-semibold leading-tight mb-2 text-parchment">
        {project.title}
      </h3>

      {project.description && (
        <p className="text-[0.8rem] text-sand leading-snug mb-3 flex-1">
          {project.description.length > 80
            ? project.description.slice(0, 80) + "..."
            : project.description}
        </p>
      )}

      {hasUnmetBlockers && (
        <div className="text-xs mb-2 flex items-center gap-1 text-coral">
          <Link2 size={11} />
          Blocked by {blockers.filter((b) => b.status !== "complete").length}
        </div>
      )}
      {isExteriorPlanned && weather && (
        <div
          className="text-xs mb-2 flex items-center gap-1"
          style={{ color: weatherGood ? "#5DBB97" : "#A89878" }}
        >
          {weatherGood ? <Sun size={11} /> : <CloudRain size={11} />}
          {weatherGood ? "Weather good" : "Wait for weather"}
        </div>
      )}

      <div className="flex items-center gap-3 text-xs flex-wrap mt-auto text-sand font-mono">
        {project.assignee && (
          <span className="flex items-center gap-1">
            <User size={11} /> {project.assignee}
          </span>
        )}
        {project.cost > 0 && (
          <span className="flex items-center gap-1">
            <DollarSign size={11} />
            {Number(project.cost).toLocaleString()}
          </span>
        )}
        {project.hoursSpent > 0 && (
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {project.hoursSpent}h
          </span>
        )}
        {project.beforePhotos.length + project.afterPhotos.length > 0 && (
          <span className="flex items-center gap-1">
            <ImageIcon size={11} />
            {project.beforePhotos.length + project.afterPhotos.length}
          </span>
        )}
        <span
          className="flex items-center gap-1"
          style={{ color: priority.color }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full inline-block"
            style={{ background: priority.color }}
          />
          {priority.label}
        </span>
      </div>
    </button>
  );
}
