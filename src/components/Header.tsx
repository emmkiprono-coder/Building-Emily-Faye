"use client";

import { Anchor, Download, Sparkles } from "lucide-react";
import { SaveIndicator, ViewTab } from "./primitives";

export type ViewMode = "board" | "dashboard" | "inventory";
export type SaveStatus = "idle" | "saving" | "saved" | "error";

interface HeaderProps {
  saveStatus: SaveStatus;
  view: ViewMode;
  setView: (v: ViewMode) => void;
  onExport: () => void;
  onAgentic: () => void;
}

export function Header({
  saveStatus,
  view,
  setView,
  onExport,
  onAgentic,
}: HeaderProps) {
  return (
    <header
      className="compass-bg border-b"
      style={{ borderColor: "rgba(196, 154, 80, 0.2)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-12 h-12 rounded-full"
              style={{
                background: "linear-gradient(135deg, #C49A50 0%, #8B6F3A 100%)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.2), 0 2px 8px rgba(0,0,0,0.3)",
              }}
            >
              <Anchor size={22} style={{ color: "#0F1B2C" }} />
            </div>
            <div>
              <h1
                className="font-bold leading-tight m-0 text-parchment"
                style={{
                  fontSize: "clamp(1.4rem, 4vw, 2rem)",
                  letterSpacing: "-0.02em",
                  fontVariationSettings: '"opsz" 144',
                }}
              >
                Emily Faye
              </h1>
              <p className="text-[0.78rem] uppercase tracking-[0.15em] text-brass m-0 font-mono">
                Restoration Log · 1979 C&amp;C 29
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <SaveIndicator status={saveStatus} />
            <button
              onClick={onAgentic}
              className="brass-button rounded-lg px-3 py-2 text-sm flex items-center gap-1.5"
              aria-label="Open AI assistant"
            >
              <Sparkles size={14} /> AI
            </button>
            <button
              onClick={onExport}
              className="rounded-lg px-3 py-2 text-sm flex items-center gap-1.5 text-parchment"
              style={{
                background: "rgba(244, 236, 216, 0.06)",
                border: "1px solid rgba(196, 154, 80, 0.2)",
              }}
              aria-label="Export data"
            >
              <Download size={14} /> Export
            </button>
          </div>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto scrollbar-thin">
          <ViewTab active={view === "board"} onClick={() => setView("board")}>
            Board
          </ViewTab>
          <ViewTab
            active={view === "dashboard"}
            onClick={() => setView("dashboard")}
          >
            Dashboard
          </ViewTab>
          <ViewTab
            active={view === "inventory"}
            onClick={() => setView("inventory")}
          >
            Inventory
          </ViewTab>
        </div>
      </div>
    </header>
  );
}
