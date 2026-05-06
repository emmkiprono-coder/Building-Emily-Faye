"use client";

import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Check,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import { ZONE_COLOR_PALETTE } from "@/data/constants";
import type { Project, Zone, ZoneId } from "@/types/project";

interface ZoneManagerPanelProps {
  zones: Zone[];
  projects: Project[];
  onClose: () => void;
  onSave: (next: Zone[]) => void;
  onReassignProjects: (fromZone: ZoneId, toZone: ZoneId) => void;
  onDeleteProjectsInZone: (zoneId: ZoneId) => void;
}

interface PendingDelete {
  zone: Zone;
  projectCount: number;
  mode: "reassign" | "delete" | null;
  reassignTo: ZoneId | "";
}

function generateZoneId(existing: Zone[]): string {
  // Find the highest numeric suffix and increment
  const nums = existing
    .map((z) => {
      const m = z.id.match(/^zone(\d+)$/);
      return m ? parseInt(m[1], 10) : 0;
    })
    .filter((n) => n > 0);
  const next = nums.length ? Math.max(...nums) + 1 : 1;
  return `zone${next}`;
}

function pickNextColor(existing: Zone[]): string {
  const used = new Set(existing.map((z) => z.color.toLowerCase()));
  return (
    ZONE_COLOR_PALETTE.find((c) => !used.has(c.toLowerCase())) ??
    ZONE_COLOR_PALETTE[0]
  );
}

export function ZoneManagerPanel({
  zones,
  projects,
  onClose,
  onSave,
  onReassignProjects,
  onDeleteProjectsInZone,
}: ZoneManagerPanelProps) {
  const [draft, setDraft] = useState<Zone[]>(() =>
    zones.map((z) => ({ ...z }))
  );
  const [editingId, setEditingId] = useState<ZoneId | null>(null);
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(
    null
  );

  const addZone = () => {
    const id = generateZoneId(draft);
    const num = draft.length + 1;
    const newZone: Zone = {
      id,
      name: `Zone ${num}: New Zone`,
      short: "New",
      color: pickNextColor(draft),
    };
    setDraft([...draft, newZone]);
    setEditingId(id);
  };

  const updateZone = (id: ZoneId, updates: Partial<Zone>) => {
    setDraft(draft.map((z) => (z.id === id ? { ...z, ...updates } : z)));
  };

  const moveZone = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= draft.length) return;
    const next = [...draft];
    [next[idx], next[target]] = [next[target], next[idx]];
    setDraft(next);
  };

  const requestDelete = (zone: Zone) => {
    const count = projects.filter((p) => p.zone === zone.id).length;
    if (count === 0) {
      // Safe to delete immediately
      setDraft(draft.filter((z) => z.id !== zone.id));
      return;
    }
    setPendingDelete({
      zone,
      projectCount: count,
      mode: null,
      reassignTo: "",
    });
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    const { zone, mode, reassignTo } = pendingDelete;
    if (mode === "reassign" && reassignTo) {
      onReassignProjects(zone.id, reassignTo);
    } else if (mode === "delete") {
      onDeleteProjectsInZone(zone.id);
    } else {
      return;
    }
    setDraft(draft.filter((z) => z.id !== zone.id));
    setPendingDelete(null);
  };

  const handleSave = () => {
    // Validate: at least one zone, no empty names
    if (draft.length === 0) {
      alert("You need at least one zone.");
      return;
    }
    if (draft.some((z) => !z.name.trim() || !z.short.trim())) {
      alert("Zone name and short label cannot be empty.");
      return;
    }
    onSave(draft);
    onClose();
  };

  const projectCountFor = (zoneId: ZoneId) =>
    projects.filter((p) => p.zone === zoneId).length;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 fade-in"
      style={{
        background: "rgba(15, 27, 44, 0.85)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        className="w-full sm:max-w-2xl max-h-[95vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl scrollbar-thin"
        style={{
          background: "linear-gradient(180deg, #1A2A40 0%, #14253A 100%)",
          border: "1px solid rgba(196, 154, 80, 0.3)",
        }}
      >
        <div
          className="sticky top-0 z-10 px-4 sm:px-6 py-4 flex items-center justify-between"
          style={{
            background:
              "linear-gradient(180deg, #1A2A40 0%, rgba(26, 42, 64, 0.95) 100%)",
            borderBottom: "1px solid rgba(196, 154, 80, 0.2)",
            backdropFilter: "blur(8px)",
          }}
        >
          <h2 className="text-base font-semibold text-parchment">
            Manage Zones
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-full flex items-center justify-center text-parchment"
            style={{ background: "rgba(244, 236, 216, 0.06)" }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          <p className="text-xs text-sand">
            Add, rename, recolor, reorder, or delete zones. Projects keep their
            zone assignment automatically. Deleting a zone with projects in it
            will ask whether to reassign or delete those projects.
          </p>

          <div className="space-y-2">
            {draft.map((z, idx) => {
              const isEditing = editingId === z.id;
              const count = projectCountFor(z.id);
              return (
                <div
                  key={z.id}
                  className="rounded-lg p-3"
                  style={{
                    background: "rgba(244, 236, 216, 0.04)",
                    border: `1px solid ${
                      isEditing
                        ? "rgba(196, 154, 80, 0.5)"
                        : "rgba(196, 154, 80, 0.15)"
                    }`,
                  }}
                >
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        value={z.name}
                        onChange={(e) =>
                          updateZone(z.id, { name: e.target.value })
                        }
                        placeholder="Full name (e.g., Zone 6: Engine Room)"
                        className="w-full px-3 py-2 rounded text-sm input-field"
                      />
                      <input
                        value={z.short}
                        onChange={(e) =>
                          updateZone(z.id, { short: e.target.value })
                        }
                        placeholder="Short label (e.g., Engine)"
                        className="w-full px-3 py-2 rounded text-sm input-field"
                      />
                      <div>
                        <div className="text-[0.7rem] uppercase tracking-[0.12em] mb-1.5 font-mono font-semibold text-brass">
                          Color
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          {ZONE_COLOR_PALETTE.map((c) => (
                            <button
                              key={c}
                              onClick={() => updateZone(z.id, { color: c })}
                              className="w-8 h-8 rounded-full transition-all"
                              style={{
                                background: c,
                                border:
                                  z.color === c
                                    ? "2px solid #F4ECD8"
                                    : "2px solid transparent",
                              }}
                              aria-label={`Pick color ${c}`}
                            />
                          ))}
                        </div>
                      </div>
                      <button
                        onClick={() => setEditingId(null)}
                        className="brass-button px-3 py-1.5 rounded text-xs flex items-center gap-1"
                      >
                        <Check size={12} /> Done
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ background: z.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-parchment font-semibold text-sm truncate">
                          {z.name}
                        </div>
                        <div className="text-xs text-sand font-mono">
                          {z.short} · {count}{" "}
                          {count === 1 ? "project" : "projects"}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveZone(idx, -1)}
                          disabled={idx === 0}
                          aria-label="Move up"
                          className="w-8 h-8 rounded flex items-center justify-center text-sand disabled:opacity-30"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          onClick={() => moveZone(idx, 1)}
                          disabled={idx === draft.length - 1}
                          aria-label="Move down"
                          className="w-8 h-8 rounded flex items-center justify-center text-sand disabled:opacity-30"
                        >
                          <ArrowDown size={14} />
                        </button>
                        <button
                          onClick={() => setEditingId(z.id)}
                          aria-label="Edit zone"
                          className="w-8 h-8 rounded flex items-center justify-center text-brass"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => requestDelete(z)}
                          aria-label="Delete zone"
                          className="w-8 h-8 rounded flex items-center justify-center text-coral"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <button
            onClick={addZone}
            className="brass-button w-full py-2.5 rounded-lg text-sm flex items-center justify-center gap-2"
          >
            <Plus size={14} /> Add Zone
          </button>

          {pendingDelete && (
            <div
              className="rounded-lg p-4 space-y-3"
              style={{
                background: "rgba(229, 104, 91, 0.08)",
                border: "1px solid rgba(229, 104, 91, 0.3)",
              }}
            >
              <div className="flex items-center gap-2 text-coral">
                <AlertTriangle size={16} />
                <span className="font-semibold text-sm">
                  Delete &quot;{pendingDelete.zone.name}&quot;?
                </span>
              </div>
              <p className="text-xs text-parchment">
                This zone has{" "}
                <strong>{pendingDelete.projectCount}</strong>{" "}
                {pendingDelete.projectCount === 1 ? "project" : "projects"}.
                What should happen to{" "}
                {pendingDelete.projectCount === 1 ? "it" : "them"}?
              </p>
              <div className="flex flex-col gap-2">
                <label
                  className="flex items-center gap-2 p-2 rounded cursor-pointer"
                  style={{ background: "rgba(244, 236, 216, 0.04)" }}
                >
                  <input
                    type="radio"
                    name="delete-mode"
                    checked={pendingDelete.mode === "reassign"}
                    onChange={() =>
                      setPendingDelete({
                        ...pendingDelete,
                        mode: "reassign",
                      })
                    }
                    style={{ accentColor: "#C49A50" }}
                  />
                  <span className="text-sm text-parchment">
                    Reassign to another zone
                  </span>
                </label>
                {pendingDelete.mode === "reassign" && (
                  <select
                    value={pendingDelete.reassignTo}
                    onChange={(e) =>
                      setPendingDelete({
                        ...pendingDelete,
                        reassignTo: e.target.value,
                      })
                    }
                    className="px-3 py-2 rounded text-sm input-field ml-6"
                  >
                    <option value="">Pick a zone...</option>
                    {draft
                      .filter((z) => z.id !== pendingDelete.zone.id)
                      .map((z) => (
                        <option key={z.id} value={z.id}>
                          {z.name}
                        </option>
                      ))}
                  </select>
                )}
                <label
                  className="flex items-center gap-2 p-2 rounded cursor-pointer"
                  style={{ background: "rgba(244, 236, 216, 0.04)" }}
                >
                  <input
                    type="radio"
                    name="delete-mode"
                    checked={pendingDelete.mode === "delete"}
                    onChange={() =>
                      setPendingDelete({ ...pendingDelete, mode: "delete" })
                    }
                    style={{ accentColor: "#E5685B" }}
                  />
                  <span className="text-sm text-parchment">
                    Delete projects too (cannot be undone)
                  </span>
                </label>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={confirmDelete}
                  disabled={
                    !pendingDelete.mode ||
                    (pendingDelete.mode === "reassign" &&
                      !pendingDelete.reassignTo)
                  }
                  className="px-3 py-1.5 rounded text-xs font-semibold disabled:opacity-50"
                  style={{ background: "#E5685B", color: "#0F1B2C" }}
                >
                  Confirm
                </button>
                <button
                  onClick={() => setPendingDelete(null)}
                  className="px-3 py-1.5 rounded text-xs text-parchment"
                  style={{ background: "rgba(244, 236, 216, 0.08)" }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div
            className="pt-4 flex gap-2 justify-end"
            style={{ borderTop: "1px solid rgba(196, 154, 80, 0.15)" }}
          >
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-sm text-parchment"
              style={{ background: "rgba(244, 236, 216, 0.08)" }}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="brass-button px-4 py-2 rounded-lg text-sm"
            >
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
