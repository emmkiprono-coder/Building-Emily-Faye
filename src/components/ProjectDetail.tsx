"use client";

import {
  AlertCircle,
  Camera,
  DollarSign,
  ListChecks,
  Mic,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import type { Project, Zone, ZoneId } from "@/types/project";
import { PRIORITIES, STATUSES } from "@/data/constants";
import { AIButton, Label } from "./primitives";
import { AIToolPanel, type AIToolName } from "./AIToolPanel";
import { BlockerSelector } from "./BlockerSelector";
import { PhotoSection } from "./PhotoSection";

interface ProjectDetailProps {
  project: Project;
  allProjects: Project[];
  zones: Zone[];
  onClose: () => void;
  onUpdate: (updates: Partial<Project>) => void;
  onDelete: () => void;
  onAddProject: (zone: ZoneId, overrides?: Partial<Project>) => Project;
}

export function ProjectDetail({
  project,
  allProjects,
  zones,
  onClose,
  onUpdate,
  onDelete,
  onAddProject,
}: ProjectDetailProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [newPart, setNewPart] = useState("");
  const [aiPanel, setAiPanel] = useState<AIToolName | null>(null);
  const zone = zones.find((z) => z.id === project.zone);
  if (!zone) return null;

  const handleFileUpload = (
    field: "beforePhotos" | "afterPhotos" | "videos",
    files: FileList
  ) => {
    const arr = Array.from(files);
    Promise.all(
      arr.map(
        (file) =>
          new Promise<{
            id: string;
            name: string;
            dataUrl: string;
            size: number;
            type: string;
            uploadedAt: string;
          }>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
              const dataUrl = e.target?.result;
              if (typeof dataUrl !== "string") return reject(new Error("Read failed"));
              resolve({
                id: `${Date.now()}_${Math.random()}`,
                name: file.name,
                dataUrl,
                size: file.size,
                type: file.type,
                uploadedAt: new Date().toISOString(),
              });
            };
            reader.onerror = () => reject(new Error("Read failed"));
            reader.readAsDataURL(file);
          })
      )
    )
      .then((newFiles) => {
        onUpdate({ [field]: [...(project[field] || []), ...newFiles] } as Partial<Project>);
      })
      .catch((err) => console.error("Upload failed:", err));
  };

  const removeFile = (
    field: "beforePhotos" | "afterPhotos" | "videos",
    fileId: string
  ) => {
    onUpdate({
      [field]: project[field].filter((f) => f.id !== fileId),
    } as Partial<Project>);
  };

  const addPart = () => {
    if (!newPart.trim()) return;
    onUpdate({
      parts: [
        ...(project.parts || []),
        { id: Date.now(), name: newPart.trim() },
      ],
    });
    setNewPart("");
  };

  const removePart = (id: number) => {
    onUpdate({ parts: project.parts.filter((p) => p.id !== id) });
  };

  const toggleBlocker = (blockerId: string) => {
    const current = project.blockedBy || [];
    onUpdate({
      blockedBy: current.includes(blockerId)
        ? current.filter((id) => id !== blockerId)
        : [...current, blockerId],
    });
  };

  return (
    <div
      className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-0 sm:p-4 fade-in"
      style={{
        background: "rgba(15, 27, 44, 0.85)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        className="w-full sm:max-w-3xl max-h-[95vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl scrollbar-thin"
        style={{
          background: "linear-gradient(180deg, #1A2A40 0%, #14253A 100%)",
          border: "1px solid rgba(196, 154, 80, 0.3)",
          boxShadow: "0 -8px 30px rgba(0,0,0,0.5)",
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
          <span
            className="text-xs px-2 py-1 rounded font-medium font-mono"
            style={{ background: `${zone.color}30`, color: zone.color }}
          >
            {zone.name}
          </span>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-parchment"
            style={{ background: "rgba(244, 236, 216, 0.06)" }}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-5">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <AIButton
              icon={<Mic size={14} />}
              label="Voice log"
              onClick={() => setAiPanel("voice")}
            />
            <AIButton
              icon={<Camera size={14} />}
              label="Photo AI"
              onClick={() => setAiPanel("photo")}
            />
            <AIButton
              icon={<ListChecks size={14} />}
              label="Break down"
              onClick={() => setAiPanel("decompose")}
            />
            <AIButton
              icon={<DollarSign size={14} />}
              label="Estimate"
              onClick={() => setAiPanel("estimate")}
            />
            <AIButton
              icon={<AlertCircle size={14} />}
              label="Risk check"
              onClick={() => setAiPanel("risk")}
            />
          </div>

          {aiPanel && (
            <AIToolPanel
              tool={aiPanel}
              project={project}
              zones={zones}
              onClose={() => setAiPanel(null)}
              onUpdate={onUpdate}
              onAddProject={onAddProject}
            />
          )}

          <div>
            <Label>Project Title</Label>
            <input
              type="text"
              value={project.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              className="w-full px-3 py-2.5 rounded-lg text-base font-semibold input-field"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Status</Label>
              <select
                value={project.status}
                onChange={(e) =>
                  onUpdate({ status: e.target.value as Project["status"] })
                }
                className="w-full px-3 py-2.5 rounded-lg text-sm input-field"
              >
                {STATUSES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Priority</Label>
              <select
                value={project.priority}
                onChange={(e) =>
                  onUpdate({ priority: e.target.value as Project["priority"] })
                }
                className="w-full px-3 py-2.5 rounded-lg text-sm input-field"
              >
                {PRIORITIES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="exterior-toggle"
              type="checkbox"
              checked={project.exteriorWork || false}
              onChange={(e) => onUpdate({ exteriorWork: e.target.checked })}
              style={{ accentColor: "#C49A50" }}
            />
            <label
              htmlFor="exterior-toggle"
              className="text-sm text-parchment"
            >
              Weather-dependent (topside / exterior work)
            </label>
          </div>

          <div>
            <Label>Description / Plan</Label>
            <textarea
              value={project.description}
              onChange={(e) => onUpdate({ description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg text-sm input-field"
            />
          </div>

          <div>
            <Label>Blocked by (must complete first)</Label>
            <BlockerSelector
              project={project}
              allProjects={allProjects}
              onToggle={toggleBlocker}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <Label>Who Did It</Label>
              <input
                type="text"
                value={project.assignee}
                onChange={(e) => onUpdate({ assignee: e.target.value })}
                placeholder="e.g., Domingo, Kip"
                className="w-full px-3 py-2.5 rounded-lg text-sm input-field"
              />
            </div>
            <div>
              <Label>Start Date</Label>
              <input
                type="date"
                value={project.startDate}
                onChange={(e) => onUpdate({ startDate: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg text-sm input-field"
              />
            </div>
            <div>
              <Label>End Date</Label>
              <input
                type="date"
                value={project.endDate}
                onChange={(e) => onUpdate({ endDate: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg text-sm input-field"
              />
            </div>
          </div>

          <div>
            <Label>Work Completed</Label>
            <textarea
              value={project.workCompleted}
              onChange={(e) => onUpdate({ workCompleted: e.target.value })}
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg text-sm input-field"
              placeholder="What was actually done?"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Estimated Cost ($)</Label>
              <input
                type="number"
                value={project.estimatedCost || 0}
                onChange={(e) =>
                  onUpdate({ estimatedCost: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2.5 rounded-lg text-sm input-field"
                min="0"
                step="1"
              />
            </div>
            <div>
              <Label>Actual Cost ($)</Label>
              <input
                type="number"
                value={project.cost}
                onChange={(e) =>
                  onUpdate({ cost: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2.5 rounded-lg text-sm input-field"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Estimated Hours</Label>
              <input
                type="number"
                value={project.estimatedHours || 0}
                onChange={(e) =>
                  onUpdate({
                    estimatedHours: parseFloat(e.target.value) || 0,
                  })
                }
                className="w-full px-3 py-2.5 rounded-lg text-sm input-field"
                min="0"
                step="0.5"
              />
            </div>
            <div>
              <Label>Actual Hours</Label>
              <input
                type="number"
                value={project.hoursSpent}
                onChange={(e) =>
                  onUpdate({ hoursSpent: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-3 py-2.5 rounded-lg text-sm input-field"
                min="0"
                step="0.5"
              />
            </div>
          </div>

          <div>
            <Label>Parts / Materials</Label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newPart}
                onChange={(e) => setNewPart(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addPart();
                  }
                }}
                placeholder="Add a part..."
                className="flex-1 px-3 py-2 rounded-lg text-sm input-field"
              />
              <button
                onClick={addPart}
                className="brass-button px-3 py-2 rounded-lg text-sm"
                aria-label="Add part"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="space-y-1.5">
              {(project.parts || []).map((part) => (
                <div
                  key={part.id}
                  className="flex items-center justify-between px-3 py-2 rounded-lg text-sm"
                  style={{
                    background: "rgba(244, 236, 216, 0.04)",
                    border: "1px solid rgba(196, 154, 80, 0.1)",
                  }}
                >
                  <span className="text-parchment">{part.name}</span>
                  <button
                    onClick={() => removePart(part.id)}
                    aria-label="Remove"
                    className="text-sand"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <PhotoSection
            label="Before Photos"
            files={project.beforePhotos}
            onAdd={(files) => handleFileUpload("beforePhotos", files)}
            onRemove={(id) => removeFile("beforePhotos", id)}
            accept="image/*"
          />
          <PhotoSection
            label="After Photos"
            files={project.afterPhotos}
            onAdd={(files) => handleFileUpload("afterPhotos", files)}
            onRemove={(id) => removeFile("afterPhotos", id)}
            accept="image/*"
          />
          <PhotoSection
            label="Videos"
            files={project.videos}
            onAdd={(files) => handleFileUpload("videos", files)}
            onRemove={(id) => removeFile("videos", id)}
            accept="video/*"
            isVideo
          />

          <div>
            <Label>Notes</Label>
            <textarea
              value={project.notes}
              onChange={(e) => onUpdate({ notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2.5 rounded-lg text-sm input-field"
              placeholder="Lessons learned, follow-ups, supplier notes..."
            />
          </div>

          <div
            className="pt-4 border-t"
            style={{ borderColor: "rgba(196, 154, 80, 0.15)" }}
          >
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-sm flex items-center gap-2 px-3 py-2 rounded-lg text-coral"
                style={{ background: "rgba(229, 104, 91, 0.08)" }}
              >
                <Trash2 size={14} /> Delete project
              </button>
            ) : (
              <div
                className="flex items-center gap-2 p-3 rounded-lg flex-wrap"
                style={{
                  background: "rgba(229, 104, 91, 0.1)",
                  border: "1px solid rgba(229, 104, 91, 0.3)",
                }}
              >
                <AlertCircle size={16} className="text-coral" />
                <span className="text-sm text-parchment">Delete forever?</span>
                <button
                  onClick={onDelete}
                  className="ml-auto text-sm px-3 py-1.5 rounded font-semibold"
                  style={{ background: "#E5685B", color: "#0F1B2C" }}
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="text-sm px-3 py-1.5 rounded text-parchment"
                  style={{ background: "rgba(244, 236, 216, 0.08)" }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
