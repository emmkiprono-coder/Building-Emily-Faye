"use client";

import { DollarSign, Loader2 } from "lucide-react";
import { useState } from "react";
import { callClaudeJson } from "@/lib/claude";
import { ZONES } from "@/data/constants";
import type { Project } from "@/types/project";

interface Estimate {
  estimatedCostLow: number;
  estimatedCostHigh: number;
  estimatedHoursLow: number;
  estimatedHoursHigh: number;
  keyMaterials: string[];
  reasoning: string;
}

interface Props {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
  onClose: () => void;
}

export function EstimateTool({ project, onUpdate, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [error, setError] = useState<string | null>(null);

  const estimateNow = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await callClaudeJson<Estimate>(
        `Estimate cost and time for this restoration task on a 1979 C&C 29 sailboat (Emily Faye), based at Montrose Harbor in Chicago.

Project: "${project.title}"
Description: "${project.description}"
Zone: ${ZONES.find((z) => z.id === project.zone)?.short}

Realistic Chicago-area marine-grade materials and DIY labor. Return ONLY:
{
  "estimatedCostLow": number,
  "estimatedCostHigh": number,
  "estimatedHoursLow": number,
  "estimatedHoursHigh": number,
  "keyMaterials": [strings],
  "reasoning": "2-3 sentences"
}`,
        { maxTokens: 800 }
      );
      setEstimate(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError("Estimate failed: " + msg);
    } finally {
      setLoading(false);
    }
  };

  const applyEstimate = () => {
    if (!estimate) return;
    onUpdate({
      estimatedCost: Math.round(
        (estimate.estimatedCostLow + estimate.estimatedCostHigh) / 2
      ),
      estimatedHours:
        Math.round(
          ((estimate.estimatedHoursLow + estimate.estimatedHoursHigh) / 2) * 10
        ) / 10,
    });
    onClose();
  };

  return (
    <div className="space-y-3">
      {!estimate && (
        <button
          onClick={estimateNow}
          disabled={loading}
          className="brass-button px-3 py-2 rounded-lg text-sm flex items-center gap-2"
        >
          {loading ? (
            <Loader2 size={14} className="spin" />
          ) : (
            <DollarSign size={14} />
          )}
          Estimate cost & time
        </button>
      )}
      {error && <p className="text-xs text-coral">{error}</p>}
      {estimate && (
        <div
          className="p-3 rounded-lg space-y-2 text-xs text-parchment"
          style={{ background: "rgba(0, 0, 0, 0.2)" }}
        >
          <div>
            <strong>Cost:</strong> ${estimate.estimatedCostLow} – $
            {estimate.estimatedCostHigh}
          </div>
          <div>
            <strong>Hours:</strong> {estimate.estimatedHoursLow} –{" "}
            {estimate.estimatedHoursHigh}
          </div>
          <div>
            <strong>Materials:</strong> {estimate.keyMaterials.join(", ")}
          </div>
          <div className="text-sand">{estimate.reasoning}</div>
          <button
            onClick={applyEstimate}
            className="brass-button px-3 py-1.5 rounded text-xs"
          >
            Apply midpoint to project
          </button>
        </div>
      )}
    </div>
  );
}
