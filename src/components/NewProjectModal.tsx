"use client";

import { X } from "lucide-react";
import type { Zone, ZoneId } from "@/types/project";

interface NewProjectModalProps {
  zones: Zone[];
  onClose: () => void;
  onSelect: (zone: ZoneId) => void;
}

export function NewProjectModal({
  zones,
  onClose,
  onSelect,
}: NewProjectModalProps) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-0 sm:p-4 fade-in"
      style={{
        background: "rgba(15, 27, 44, 0.85)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-5"
        style={{
          background:
            "linear-gradient(180deg, #1A2A40 0%, #14253A 100%)",
          border: "1px solid rgba(196, 154, 80, 0.3)",
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[1.1rem] font-semibold text-parchment">
            New Project
          </h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-sand"
          >
            <X size={20} />
          </button>
        </div>
        <p className="text-sm mb-4 text-sand">Pick a zone:</p>
        <div className="space-y-2">
          {zones.map((z) => (
            <button
              key={z.id}
              onClick={() => onSelect(z.id)}
              className="w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all text-parchment"
              style={{
                background: "rgba(244, 236, 216, 0.04)",
                border: "1px solid rgba(196, 154, 80, 0.15)",
              }}
            >
              <span
                className="w-3 h-3 rounded-full"
                style={{ background: z.color }}
              />
              <span className="font-medium">{z.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
