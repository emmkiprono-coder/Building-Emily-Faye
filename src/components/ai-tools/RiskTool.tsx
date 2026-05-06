"use client";

import { AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { callClaudeJson } from "@/lib/claude";
import { ZONES } from "@/data/constants";
import type { Project } from "@/types/project";

interface Risk {
  severity: "high" | "medium" | "low";
  issue: string;
  recommendation: string;
}

interface RisksResponse {
  risks: Risk[];
}

export function RiskTool({ project }: { project: Project }) {
  const [loading, setLoading] = useState(false);
  const [risks, setRisks] = useState<Risk[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkRisks = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await callClaudeJson<RisksResponse>(
        `Review this sailboat restoration project for risks, sequencing issues, code/safety concerns, and common mistakes.

Project: "${project.title}"
Description: "${project.description}"
Zone: ${ZONES.find((z) => z.id === project.zone)?.short}
Boat: 1979 C&C 29, fresh water (Lake Michigan), Montrose Harbor

Focus on: structural integrity, marine plumbing/electrical codes (ABYC), through-hull and below-waterline concerns, fire safety, ventilation, sequencing issues that could cost rework.

Return ONLY:
{
  "risks": [
    { "severity": "high"|"medium"|"low", "issue": "...", "recommendation": "..." }
  ]
}
3 to 6 items max.`,
        { maxTokens: 1200 }
      );
      setRisks(result.risks);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError("Risk check failed: " + msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {!risks && (
        <button
          onClick={checkRisks}
          disabled={loading}
          className="brass-button px-3 py-2 rounded-lg text-sm flex items-center gap-2"
        >
          {loading ? (
            <Loader2 size={14} className="spin" />
          ) : (
            <AlertCircle size={14} />
          )}
          Check for risks
        </button>
      )}
      {error && <p className="text-xs text-coral">{error}</p>}
      {risks && (
        <div className="space-y-2 max-h-72 overflow-y-auto scrollbar-thin">
          {risks.map((r, i) => {
            const sevColor =
              r.severity === "high"
                ? "#E5685B"
                : r.severity === "medium"
                  ? "#D97706"
                  : "#5DBB97";
            return (
              <div
                key={i}
                className="p-3 rounded-lg text-xs"
                style={{
                  background: "rgba(0, 0, 0, 0.2)",
                  borderLeft: `3px solid ${sevColor}`,
                }}
              >
                <div
                  className="font-semibold uppercase mb-1 font-mono text-[0.65rem]"
                  style={{ color: sevColor }}
                >
                  {r.severity}
                </div>
                <div className="font-semibold mb-1 text-parchment">
                  {r.issue}
                </div>
                <div className="text-sand">{r.recommendation}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
