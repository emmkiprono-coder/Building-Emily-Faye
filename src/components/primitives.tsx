"use client";

import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

export function Label({ children }: { children: ReactNode }) {
  return (
    <label
      className="block text-[0.7rem] uppercase tracking-[0.12em] mb-1.5 font-mono font-semibold text-brass"
    >
      {children}
    </label>
  );
}

export function FilterChip({
  active,
  onClick,
  children,
  color,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  color?: string;
}) {
  const bg = active
    ? color
      ? `${color}33`
      : "rgba(196, 154, 80, 0.2)"
    : "rgba(244, 236, 216, 0.04)";
  const border = active ? color || "#C49A50" : "rgba(196, 154, 80, 0.15)";
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all min-h-[32px]"
      style={{
        background: bg,
        border: `1px solid ${border}`,
        color: active ? "#F4ECD8" : "#A89878",
      }}
    >
      {children}
    </button>
  );
}

export function StatCard({
  label,
  value,
  color = "#F4ECD8",
}: {
  label: string;
  value: string | number;
  color?: string;
}) {
  return (
    <div className="nautical-card rounded-lg p-4">
      <div className="text-[0.7rem] uppercase tracking-[0.12em] text-sand font-mono mb-1.5">
        {label}
      </div>
      <div
        className="font-bold leading-tight"
        style={{
          fontSize: "clamp(1.1rem, 3.5vw, 1.5rem)",
          color,
          fontVariationSettings: '"opsz" 144',
        }}
      >
        {value}
      </div>
    </div>
  );
}

export function SaveIndicator({
  status,
}: {
  status: "idle" | "saving" | "saved" | "error";
}) {
  const map = {
    saving: { text: "● saving...", color: "#D4AB60" },
    saved: { text: "● saved", color: "#5DBB97" },
    error: { text: "● save failed", color: "#E5685B" },
    idle: { text: "● synced", color: "#5DBB97" },
  };
  const cfg = map[status];
  return (
    <div className="flex items-center text-xs px-3 py-1.5 rounded-full font-mono"
      style={{
        background: "rgba(244, 236, 216, 0.05)",
        border: "1px solid rgba(196, 154, 80, 0.2)",
      }}
    >
      <span style={{ color: cfg.color }}>{cfg.text}</span>
    </div>
  );
}

export function ViewTab({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap min-h-[40px]"
      style={{
        background: active ? "rgba(196, 154, 80, 0.15)" : "transparent",
        color: active ? "#F4ECD8" : "#A89878",
        border: `1px solid ${
          active ? "rgba(196, 154, 80, 0.4)" : "rgba(196, 154, 80, 0.15)"
        }`,
      }}
    >
      {children}
    </button>
  );
}

export function ToolButton({
  icon,
  label,
  desc,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  desc: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left p-3 rounded-lg flex items-center gap-3 transition-all"
      style={{
        background: "rgba(244, 236, 216, 0.04)",
        border: "1px solid rgba(196, 154, 80, 0.15)",
      }}
    >
      <div
        className="flex items-center justify-center w-10 h-10 rounded-lg flex-shrink-0"
        style={{
          background: "rgba(196, 154, 80, 0.15)",
          color: "#C49A50",
        }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-sm text-parchment">{label}</div>
        <div className="text-xs text-sand">{desc}</div>
      </div>
      <ChevronRight size={16} className="text-sand" />
    </button>
  );
}

export function AIButton({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all min-h-[40px]"
      style={{
        background: "rgba(196, 154, 80, 0.08)",
        border: "1px solid rgba(196, 154, 80, 0.25)",
        color: "#C49A50",
      }}
    >
      {icon} {label}
    </button>
  );
}
