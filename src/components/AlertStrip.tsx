"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";
import type { Project } from "@/types/project";

interface AlertStripProps {
  completionPrompts: Project[];
  staleProjects: Project[];
  onOpenProject: (p: Project) => void;
  onMarkComplete: (id: string) => void;
}

export function AlertStrip({
  completionPrompts,
  staleProjects,
  onOpenProject,
  onMarkComplete,
}: AlertStripProps) {
  if (completionPrompts.length === 0 && staleProjects.length === 0) return null;
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 space-y-2">
      {completionPrompts.map((p) => (
        <div
          key={p.id}
          className="rounded-lg p-3 flex items-center gap-3 flex-wrap fade-in"
          style={{
            background: "rgba(93, 187, 151, 0.08)",
            border: "1px solid rgba(93, 187, 151, 0.3)",
          }}
        >
          <CheckCircle2
            size={18}
            style={{ color: "#5DBB97", flexShrink: 0 }}
          />
          <span className="text-sm flex-1 text-parchment min-w-0">
            <span className="font-semibold">{p.title}</span> has after-photos
            and work logged. Mark complete?
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => onMarkComplete(p.id)}
              className="brass-button px-3 py-1.5 rounded text-xs"
            >
              Yes, complete
            </button>
            <button
              onClick={() => onOpenProject(p)}
              className="px-3 py-1.5 rounded text-xs text-parchment"
              style={{ background: "rgba(244, 236, 216, 0.08)" }}
            >
              Open
            </button>
          </div>
        </div>
      ))}
      {staleProjects.map((p) => (
        <div
          key={`stale-${p.id}`}
          className="rounded-lg p-3 flex items-center gap-3 flex-wrap fade-in"
          style={{
            background: "rgba(217, 119, 6, 0.08)",
            border: "1px solid rgba(217, 119, 6, 0.3)",
          }}
        >
          <AlertTriangle
            size={18}
            style={{ color: "#D97706", flexShrink: 0 }}
          />
          <span className="text-sm flex-1 text-parchment min-w-0">
            <span className="font-semibold">{p.title}</span> hasn&apos;t been
            updated in over a week. Still active?
          </span>
          <button
            onClick={() => onOpenProject(p)}
            className="px-3 py-1.5 rounded text-xs text-parchment"
            style={{ background: "rgba(244, 236, 216, 0.08)" }}
          >
            Open
          </button>
        </div>
      ))}
    </div>
  );
}
