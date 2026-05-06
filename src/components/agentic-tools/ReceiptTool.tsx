"use client";

import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { callClaudeJson } from "@/lib/claude";
import type { InventoryItem, Project, Zone } from "@/types/project";

interface ReceiptResult {
  vendor: string;
  date: string;
  total: number;
  items: { name: string; qty: number; price: number }[];
}

interface Props {
  projects: Project[];
  zones: Zone[];
  updateProject: (id: string, updates: Partial<Project>) => void;
  setInventory: (
    updater: (prev: InventoryItem[]) => InventoryItem[]
  ) => void;
}

function extractImagePayload(dataUrl: string): { mediaType: string; data: string } | null {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) return null;
  return { mediaType: match[1], data: match[2] };
}

export function ReceiptTool({ projects, zones, updateProject, setInventory }: Props) {
  const [analyzing, setAnalyzing] = useState(false);
  const [photo, setPhoto] = useState<string | null>(null);
  const [result, setResult] = useState<ReceiptResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [targetProject, setTargetProject] = useState<string>("");

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result;
      if (typeof url === "string") setPhoto(url);
    };
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    if (!photo) return;
    const payload = extractImagePayload(photo);
    if (!payload) {
      setError("Could not parse image data.");
      return;
    }
    setAnalyzing(true);
    setError(null);
    try {
      const parsed = await callClaudeJson<ReceiptResult>(
        `Extract structured data from this receipt. Return ONLY:
{
  "vendor": string,
  "date": string (YYYY-MM-DD if possible),
  "total": number,
  "items": [{ "name": string, "qty": number, "price": number }]
}`,
        { image: payload, maxTokens: 1500 }
      );
      setResult(parsed);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError("Receipt parse failed: " + msg);
    } finally {
      setAnalyzing(false);
    }
  };

  const apply = () => {
    if (!result || !targetProject) return;
    const target = projects.find((p) => p.id === targetProject);
    if (!target) return;
    const newParts = result.items.map((it) => ({
      id: Date.now() + Math.floor(Math.random() * 1000),
      name: `${it.name}${it.qty > 1 ? ` (x${it.qty})` : ""}`,
    }));
    updateProject(targetProject, {
      cost: (target.cost || 0) + result.total,
      parts: [...(target.parts || []), ...newParts],
      notes: target.notes
        ? `${target.notes}\n\nReceipt from ${result.vendor} (${result.date}): $${result.total}`
        : `Receipt from ${result.vendor} (${result.date}): $${result.total}`,
    });
    const inventoryAdds: InventoryItem[] = result.items.map((it, i) => ({
      id: Date.now() + i,
      name: it.name,
      qty: it.qty || 1,
      unit: "",
      addedAt: new Date().toISOString(),
    }));
    setInventory((prev) => [...prev, ...inventoryAdds]);
    setResult(null);
    setPhoto(null);
    alert(
      `Applied to ${target.title}: $${result.total} added, ${newParts.length} parts logged.`
    );
  };

  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-parchment">
        Receipt Scanner
      </h3>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        className="text-sm text-parchment"
      />
      {photo && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={photo} alt="Receipt" className="max-w-xs rounded-lg" />
      )}
      {photo && !result && (
        <button
          onClick={analyze}
          disabled={analyzing}
          className="brass-button px-4 py-2 rounded-lg text-sm flex items-center gap-2"
        >
          {analyzing ? (
            <Loader2 size={14} className="spin" />
          ) : (
            <Sparkles size={14} />
          )}
          Extract data
        </button>
      )}
      {error && <p className="text-xs text-coral">{error}</p>}
      {result && (
        <div
          className="p-4 rounded-lg space-y-3 text-sm text-parchment"
          style={{ background: "rgba(0, 0, 0, 0.2)" }}
        >
          <div>
            <strong>{result.vendor}</strong> · {result.date}
          </div>
          <div className="text-lg text-brass">${result.total}</div>
          <div className="space-y-1 text-xs">
            {result.items.map((it, i) => (
              <div key={i} className="flex justify-between">
                <span>
                  {it.name} {it.qty > 1 && `× ${it.qty}`}
                </span>
                <span className="text-sand">${it.price}</span>
              </div>
            ))}
          </div>
          <select
            value={targetProject}
            onChange={(e) => setTargetProject(e.target.value)}
            className="w-full px-3 py-2 rounded text-sm input-field"
          >
            <option value="">Select project to log to...</option>
            {projects
              .filter((p) => p.status !== "complete")
              .map((p) => (
                <option key={p.id} value={p.id}>
                  {zones.find((z) => z.id === p.zone)?.short}: {p.title}
                </option>
              ))}
          </select>
          <button
            onClick={apply}
            disabled={!targetProject}
            className="brass-button px-3 py-2 rounded text-sm"
          >
            Apply to project
          </button>
        </div>
      )}
    </div>
  );
}
