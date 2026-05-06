"use client";

import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { callClaude } from "@/lib/claude";
import type { Project } from "@/types/project";

interface Props {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
  onClose: () => void;
}

interface AnalysisResult {
  type: "describe" | "summary";
  text: string;
}

function extractImagePayload(dataUrl: string): { mediaType: string; data: string } | null {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  return { mediaType: match[1], data: match[2] };
}

export function PhotoAnalyzeTool({ project, onUpdate, onClose }: Props) {
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"describe" | "before-after">("describe");

  const hasBeforePhotos = project.beforePhotos.length > 0;
  const hasAfterPhotos = project.afterPhotos.length > 0;

  const analyzeFirst = async () => {
    const photo = project.beforePhotos[0];
    if (!photo) return;
    const payload = extractImagePayload(photo.dataUrl);
    if (!payload) {
      setError("Could not parse image data.");
      return;
    }
    setAnalyzing(true);
    setError(null);
    try {
      const text = await callClaude(
        `This is a "before" photo for project "${project.title}" (${project.description}) on the sailboat Emily Faye. Describe what you see, identify any issues or work needed, and suggest a brief task list. Be specific and practical.`,
        { image: payload, maxTokens: 800 }
      );
      setResult({ type: "describe", text });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError("Analysis failed: " + msg);
    } finally {
      setAnalyzing(false);
    }
  };

  const generateWorkSummary = async () => {
    if (!hasBeforePhotos || !hasAfterPhotos) {
      setError("Need both before and after photos for this.");
      return;
    }
    const before = extractImagePayload(project.beforePhotos[0].dataUrl);
    const after = extractImagePayload(project.afterPhotos[0].dataUrl);
    if (!before || !after) {
      setError("Could not parse image data.");
      return;
    }
    setAnalyzing(true);
    setError(null);
    try {
      const text = await callClaude(
        `Project: "${project.title}". Write a clear, factual "Work Completed" entry (2-4 sentences) describing what changed between before and after. Past tense. No fluff.`,
        {
          images: [
            { label: "Before photo:", image: before },
            { label: "After photo:", image: after },
          ],
          maxTokens: 600,
        }
      );
      setResult({ type: "summary", text });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError("Comparison failed: " + msg);
    } finally {
      setAnalyzing(false);
    }
  };

  const applySummary = () => {
    if (result?.type === "summary") {
      onUpdate({
        workCompleted: project.workCompleted
          ? `${project.workCompleted}\n\n${result.text}`
          : result.text,
      });
      onClose();
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <button
          onClick={() => setMode("describe")}
          className="px-3 py-1.5 rounded text-xs text-parchment"
          style={{
            background:
              mode === "describe"
                ? "rgba(196, 154, 80, 0.2)"
                : "rgba(244, 236, 216, 0.04)",
          }}
        >
          Describe before photo
        </button>
        <button
          onClick={() => setMode("before-after")}
          className="px-3 py-1.5 rounded text-xs text-parchment"
          style={{
            background:
              mode === "before-after"
                ? "rgba(196, 154, 80, 0.2)"
                : "rgba(244, 236, 216, 0.04)",
          }}
        >
          Compare before/after
        </button>
      </div>

      {mode === "describe" ? (
        <div>
          {!hasBeforePhotos ? (
            <p className="text-xs italic text-sand">
              Upload a &quot;before&quot; photo first.
            </p>
          ) : (
            <button
              onClick={analyzeFirst}
              disabled={analyzing}
              className="brass-button px-3 py-2 rounded-lg text-sm flex items-center gap-2"
            >
              {analyzing ? (
                <Loader2 size={14} className="spin" />
              ) : (
                <Sparkles size={14} />
              )}
              Describe and suggest tasks
            </button>
          )}
        </div>
      ) : (
        <div>
          {!hasBeforePhotos || !hasAfterPhotos ? (
            <p className="text-xs italic text-sand">
              Need both before and after photos.
            </p>
          ) : (
            <button
              onClick={generateWorkSummary}
              disabled={analyzing}
              className="brass-button px-3 py-2 rounded-lg text-sm flex items-center gap-2"
            >
              {analyzing ? (
                <Loader2 size={14} className="spin" />
              ) : (
                <Sparkles size={14} />
              )}
              Generate &quot;Work Completed&quot;
            </button>
          )}
        </div>
      )}

      {error && <p className="text-xs text-coral">{error}</p>}
      {result && (
        <div
          className="p-3 rounded-lg text-sm text-parchment whitespace-pre-wrap"
          style={{ background: "rgba(0, 0, 0, 0.2)" }}
        >
          {result.text}
          {result.type === "summary" && (
            <button
              onClick={applySummary}
              className="brass-button px-3 py-1.5 rounded text-xs mt-3 block"
            >
              Use as Work Completed
            </button>
          )}
        </div>
      )}
    </div>
  );
}
