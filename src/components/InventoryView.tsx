"use client";

import { Plus, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { InventoryItem, Project } from "@/types/project";

interface InventoryViewProps {
  inventory: InventoryItem[];
  setInventory: (
    updater: (prev: InventoryItem[]) => InventoryItem[]
  ) => void;
  projects: Project[];
}

export function InventoryView({
  inventory,
  setInventory,
  projects,
}: InventoryViewProps) {
  const [name, setName] = useState("");
  const [qty, setQty] = useState<number | string>(1);
  const [unit, setUnit] = useState("");

  const allParts = useMemo(() => {
    const seen = new Map<string, { name: string; projects: string[] }>();
    projects.forEach((p) => {
      (p.parts || []).forEach((part) => {
        const key = part.name.toLowerCase();
        if (!seen.has(key))
          seen.set(key, { name: part.name, projects: [] });
        seen.get(key)!.projects.push(p.title);
      });
    });
    return Array.from(seen.values());
  }, [projects]);

  const addItem = () => {
    if (!name.trim()) return;
    setInventory((prev) => [
      ...prev,
      {
        id: Date.now(),
        name: name.trim(),
        qty: Number(qty) || 1,
        unit,
        addedAt: new Date().toISOString(),
      },
    ]);
    setName("");
    setQty(1);
    setUnit("");
  };

  const updateItem = (id: number, updates: Partial<InventoryItem>) => {
    setInventory((prev) =>
      prev.map((i) => (i.id === id ? { ...i, ...updates } : i))
    );
  };

  const removeItem = (id: number) =>
    setInventory((prev) => prev.filter((i) => i.id !== id));

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div className="nautical-card rounded-lg p-5">
        <h3 className="text-base font-semibold text-parchment mb-3">
          On-hand Inventory
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 mb-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Part name"
            className="px-3 py-2 rounded text-sm sm:col-span-2 input-field"
          />
          <input
            type="number"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            placeholder="Qty"
            className="px-3 py-2 rounded text-sm input-field"
          />
          <div className="flex gap-2">
            <input
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              placeholder="Unit"
              className="flex-1 px-3 py-2 rounded text-sm input-field"
            />
            <button
              onClick={addItem}
              className="brass-button px-3 py-2 rounded text-sm"
              aria-label="Add item"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
        {inventory.length === 0 ? (
          <p className="text-xs italic text-sand">
            No inventory tracked yet.
          </p>
        ) : (
          <div className="space-y-1.5">
            {inventory.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-2 px-3 py-2 rounded text-sm flex-wrap"
                style={{
                  background: "rgba(244, 236, 216, 0.04)",
                  border: "1px solid rgba(196, 154, 80, 0.1)",
                }}
              >
                <span className="text-parchment flex-1">{item.name}</span>
                <input
                  type="number"
                  value={item.qty}
                  onChange={(e) =>
                    updateItem(item.id, { qty: Number(e.target.value) || 0 })
                  }
                  className="w-16 px-2 py-1 rounded text-xs input-field"
                />
                <span className="text-xs text-sand">{item.unit}</span>
                <button
                  onClick={() => removeItem(item.id)}
                  aria-label="Remove"
                  className="text-sand"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="nautical-card rounded-lg p-5">
        <h3 className="text-base font-semibold text-parchment mb-1">
          All Parts Across Projects
        </h3>
        <p className="text-xs mb-3 text-sand">
          Aggregated from every project&apos;s parts list.
        </p>
        {allParts.length === 0 ? (
          <p className="text-xs italic text-sand">No parts logged yet.</p>
        ) : (
          <div className="space-y-1.5">
            {allParts.map((p, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-2 px-3 py-2 rounded text-sm flex-wrap"
                style={{
                  background: "rgba(244, 236, 216, 0.04)",
                  border: "1px solid rgba(196, 154, 80, 0.1)",
                }}
              >
                <span className="text-parchment">{p.name}</span>
                <span className="text-xs text-sand font-mono">
                  used in {p.projects.length} project
                  {p.projects.length === 1 ? "" : "s"}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
