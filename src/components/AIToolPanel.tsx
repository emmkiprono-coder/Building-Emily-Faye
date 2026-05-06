"use client";

import { Sparkles, X } from "lucide-react";
import type { Project, ZoneId } from "@/types/project";
import { VoiceLogTool } from "./ai-tools/VoiceLogTool";
import { PhotoAnalyzeTool } from "./ai-tools/PhotoAnalyzeTool";
import { DecomposeTool } from "./ai-tools/DecomposeTool";
import { EstimateTool } from "./ai-tools/EstimateTool";
import { RiskTool } from "./ai-tools/RiskTool";

export type AIToolName =
  | "voice"
  | "photo"
  | "decompose"
  | "estimate"
  | "risk";

const TITLES: Record<AIToolName, string> = {
  voice: "Voice-to-log",
  photo: "Photo analysis",
  decompose: "Break into subtasks",
  estimate: "Cost & time estimate",
  risk: "Risk advisor",
};

interface AIToolPanelProps {
  tool: AIToolName;
  project: Project;
  onClose: () => void;
  onUpdate: (updates: Partial<Project>) => void;
  onAddProject: (zone: ZoneId, overrides?: Partial<Project>) => Project;
}

export function AIToolPanel({
  tool,
  project,
  onClose,
  onUpdate,
  onAddProject,
}: AIToolPanelProps) {
  return (
    <div
      className="rounded-lg p-4 fade-in"
      style={{
        background:
          "linear-gradient(135deg, rgba(196, 154, 80, 0.08) 0%, rgba(196, 154, 80, 0.04) 100%)",
        border: "1px solid rgba(196, 154, 80, 0.4)",
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold flex items-center gap-2 text-brass">
          <Sparkles size={14} /> {TITLES[tool]}
        </span>
        <button
          onClick={onClose}
          aria-label="Close AI panel"
          className="text-sand"
        >
          <X size={16} />
        </button>
      </div>
      {tool === "voice" && (
        <VoiceLogTool
          project={project}
          onUpdate={onUpdate}
          onClose={onClose}
        />
      )}
      {tool === "photo" && (
        <PhotoAnalyzeTool
          project={project}
          onUpdate={onUpdate}
          onClose={onClose}
        />
      )}
      {tool === "decompose" && (
        <DecomposeTool
          project={project}
          onAddProject={onAddProject}
          onClose={onClose}
        />
      )}
      {tool === "estimate" && (
        <EstimateTool
          project={project}
          onUpdate={onUpdate}
          onClose={onClose}
        />
      )}
      {tool === "risk" && <RiskTool project={project} />}
    </div>
  );
}
