"use client";

import { Activity, Loader2 } from "lucide-react";
import { useState } from "react";
import { callClaude } from "@/lib/claude";
import type { DeadlineInfo } from "@/lib/compute";
import type { Project } from "@/types/project";

export function StandupTool({
  projects,
  deadline,
}: {
  projects: Project[];
  deadline: DeadlineInfo;
}) {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      const recentlyUpdated = projects.filter(
        (p) => new Date(p.updatedAt).getTime() > sevenDaysAgo
      );
      const inProgress = projects.filter((p) => p.status === "in_progress");
      const blocked = projects.filter((p) => p.status === "blocked");
      const summary = {
        recentUpdates: recentlyUpdated.map((p) => ({
          title: p.title,
          status: p.status,
          workCompleted: p.workCompleted,
          hoursSpent: p.hoursSpent,
        })),
        inProgress: inProgress.map((p) => p.title),
        blocked: blocked.map((p) => ({ title: p.title, notes: p.notes })),
        deadline: {
          days: deadline.daysRemaining,
          remaining: deadline.remaining,
          velocity: deadline.requiredVelocity,
        },
      };
      const result = await callClaude(
        `You are writing a daily standup update for Emmanuel "Kip" Chepkwony, captain of TMarK Charters, on the Emily Faye sailboat restoration.

Project state:
${JSON.stringify(summary, null, 2)}

Write a Slack-ready standup with three sections: "Yesterday", "Today", "Blockers". Tight, no fluff, no em-dashes. Use commas or periods instead. Specific to actual project titles. Around 150 words max.`,
        { maxTokens: 800 }
      );
      setOutput(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-parchment">Daily Standup</h3>
      {!output && (
        <button
          onClick={generate}
          disabled={loading}
          className="brass-button px-4 py-2 rounded-lg text-sm flex items-center gap-2"
        >
          {loading ? (
            <Loader2 size={14} className="spin" />
          ) : (
            <Activity size={14} />
          )}
          Generate standup
        </button>
      )}
      {error && <p className="text-xs text-coral">{error}</p>}
      {output && (
        <div
          className="p-4 rounded-lg whitespace-pre-wrap text-sm text-parchment"
          style={{ background: "rgba(0, 0, 0, 0.2)" }}
        >
          {output}
          <button
            onClick={() => navigator.clipboard.writeText(output)}
            className="brass-button px-3 py-1.5 rounded text-xs mt-3 block"
          >
            Copy to clipboard
          </button>
        </div>
      )}
    </div>
  );
}
