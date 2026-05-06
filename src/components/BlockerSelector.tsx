"use client";

import { ChevronRight } from "lucide-react";
import { useState } from "react";
import type { Project } from "@/types/project";

interface BlockerSelectorProps {
  project: Project;
  allProjects: Project[];
  onToggle: (blockerId: string) => void;
}

export function BlockerSelector({
  project,
  allProjects,
  onToggle,
}: BlockerSelectorProps) {
  const [open, setOpen] = useState(false);
  const candidates = allProjects.filter(
    (p) => p.id !== project.id && p.zone === project.zone
  );
  const selected = (project.blockedBy || [])
    .map((id) => allProjects.find((p) => p.id === id))
    .filter((p): p is Project => Boolean(p));

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-3 py-2 rounded-lg text-sm flex items-center justify-between input-field"
      >
        <span>
          {selected.length === 0
            ? "None"
            : `${selected.length} blocker(s)`}
        </span>
        <ChevronRight
          size={14}
          style={{
            transform: open ? "rotate(90deg)" : "rotate(0)",
            transition: "transform 0.2s",
          }}
        />
      </button>
      {open && (
        <div
          className="mt-2 max-h-48 overflow-y-auto rounded-lg space-y-1 p-2 scrollbar-thin"
          style={{
            background: "rgba(0, 0, 0, 0.2)",
            border: "1px solid rgba(196, 154, 80, 0.15)",
          }}
        >
          {candidates.length === 0 && (
            <p className="text-xs italic text-sand">
              No other projects in this zone.
            </p>
          )}
          {candidates.map((c) => (
            <label
              key={c.id}
              className="flex items-center gap-2 p-2 rounded cursor-pointer"
              style={{ background: "rgba(244, 236, 216, 0.03)" }}
            >
              <input
                type="checkbox"
                checked={(project.blockedBy || []).includes(c.id)}
                onChange={() => onToggle(c.id)}
                style={{ accentColor: "#C49A50" }}
              />
              <span
                className="text-xs"
                style={{
                  color: c.status === "complete" ? "#5DBB97" : "#F4ECD8",
                }}
              >
                {c.title} {c.status === "complete" && "✓"}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
