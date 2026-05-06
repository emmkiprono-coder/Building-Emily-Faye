"use client";

import { ListChecks, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { callClaudeJson } from "@/lib/claude";
import { ZONES } from "@/data/constants";
import type { Project, ZoneId, PriorityId } from "@/types/project";

interface Subtask {
  title: string;
  description: string;
  estimatedHours: number;
  priority: PriorityId;
}

interface Props {
  project: Project;
  onAddProject: (zone: ZoneId, overrides?: Partial<Project>) => Project;
  onClose: () => void;
}

export function DecomposeTool({ project, onAddProject, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState<Subtask[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const decompose = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await callClaudeJson<Subtask[]>(
        `Break down this sailboat restoration project into concrete subtasks for a 1979 C&C 29 sailboat (Emily Faye) being restored at Montrose Harbor, Chicago.

Project: "${project.title}"
Description: "${project.description}"
Zone: ${ZONES.find((z) => z.id === project.zone)?.short}

Return ONLY a JSON array, 5 to 10 subtasks, each:
[
  { "title": "short action title", "description": "1 sentence", "estimatedHours": number, "priority": "low" | "medium" | "high" }
]`,
        { maxTokens: 1500 }
      );
      setTasks(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError("Decompose failed: " + msg);
    } finally {
      setLoading(false);
    }
  };

  const addAll = () => {
    if (!tasks) return;
    tasks.forEach((t) => {
      onAddProject(project.zone, {
        title: t.title,
        description: t.description,
        priority: t.priority || "medium",
        estimatedHours: t.estimatedHours || 0,
        blockedBy: [],
        notes: `Subtask of: ${project.title}`,
      });
    });
    onClose();
  };

  return (
    <div className="space-y-3">
      {!tasks && (
        <button
          onClick={decompose}
          disabled={loading}
          className="brass-button px-3 py-2 rounded-lg text-sm flex items-center gap-2"
        >
          {loading ? (
            <Loader2 size={14} className="spin" />
          ) : (
            <ListChecks size={14} />
          )}
          Generate subtasks
        </button>
      )}
      {error && <p className="text-xs text-coral">{error}</p>}
      {tasks && (
        <div className="space-y-2">
          <div className="space-y-1.5 max-h-64 overflow-y-auto scrollbar-thin">
            {tasks.map((t, i) => (
              <div
                key={i}
                className="p-2 rounded text-xs"
                style={{ background: "rgba(0, 0, 0, 0.2)" }}
              >
                <div className="font-semibold text-parchment">{t.title}</div>
                <div className="text-sand">{t.description}</div>
                <div className="mt-1 text-brass font-mono">
                  ~{t.estimatedHours}h · {t.priority}
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={addAll}
            className="brass-button px-3 py-2 rounded-lg text-sm flex items-center gap-2"
          >
            <Plus size={14} /> Add all {tasks.length} as projects
          </button>
        </div>
      )}
    </div>
  );
}
