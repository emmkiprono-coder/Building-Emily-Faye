"use client";

import { useState } from "react";
import type { DeadlineInfo, OverallStats, ZoneStats } from "@/lib/compute";
import type { Meta, ZoneId } from "@/types/project";
import { StatCard } from "./primitives";

interface DashboardProps {
  stats: OverallStats;
  deadline: DeadlineInfo;
  meta: Meta;
  setMeta: (updater: (prev: Meta) => Meta) => void;
}

function DeadlineCard({ deadline }: { deadline: DeadlineInfo }) {
  const color = deadline.isCritical
    ? "#E5685B"
    : deadline.isUrgent
      ? "#D97706"
      : "#5DBB97";
  return (
    <div
      className="nautical-card rounded-lg p-5"
      style={{ borderColor: color, borderWidth: "1px" }}
    >
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="text-[0.7rem] uppercase tracking-[0.12em] text-sand font-mono">
            July 4, 2026 Launch
          </div>
          <div
            className="font-bold leading-none mt-1"
            style={{
              fontSize: "clamp(1.6rem, 5vw, 2.4rem)",
              color,
              fontVariationSettings: '"opsz" 144',
            }}
          >
            {deadline.daysRemaining} days
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-parchment">
            {deadline.remaining} projects remaining
          </div>
          <div className="text-xs mt-1 text-sand font-mono">
            Required:{" "}
            <strong style={{ color }}>
              {deadline.requiredVelocity} projects/week
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}

function ZoneRow({
  zone,
  budget,
  onBudgetChange,
}: {
  zone: ZoneStats;
  budget: number;
  onBudgetChange: (b: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const overBudget = zone.cost > budget;
  return (
    <div className="nautical-card rounded-lg p-4">
      <div className="flex items-center justify-between flex-wrap gap-2 mb-2">
        <div className="flex items-center gap-2">
          <span
            className="w-3 h-3 rounded-full"
            style={{ background: zone.color }}
          />
          <span className="text-parchment font-semibold text-[0.95rem]">
            {zone.name}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-sand font-mono">
          <span>
            {zone.complete}/{zone.total}
          </span>
          <span style={{ color: overBudget ? "#E5685B" : "#C49A50" }}>
            ${zone.cost.toLocaleString()}
          </span>
          <span className="text-sand">/ </span>
          {editing ? (
            <input
              type="number"
              defaultValue={budget}
              onBlur={(e) => {
                onBudgetChange(parseFloat(e.target.value) || 0);
                setEditing(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") (e.target as HTMLInputElement).blur();
              }}
              autoFocus
              className="w-20 px-1 py-0.5 text-xs rounded input-field"
            />
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="text-sand"
              style={{ textDecoration: "underline dotted" }}
            >
              ${budget.toLocaleString()}
            </button>
          )}
          <span>{zone.hours}h</span>
        </div>
      </div>
      <div
        style={{
          height: "6px",
          background: "rgba(244, 236, 216, 0.06)",
          borderRadius: "3px",
          overflow: "hidden",
          marginBottom: "4px",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${zone.pct}%`,
            background: zone.color,
            transition: "width 0.5s ease",
          }}
        />
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-sand font-mono">completion: {zone.pct}%</span>
        <span
          className="font-mono"
          style={{
            color: overBudget
              ? "#E5685B"
              : zone.budgetPct > 80
                ? "#D97706"
                : "#A89878",
          }}
        >
          budget: {zone.budgetPct}% {overBudget && "⚠ OVER"}
        </span>
      </div>
    </div>
  );
}

export function Dashboard({ stats, deadline, meta, setMeta }: DashboardProps) {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      <DeadlineCard deadline={deadline} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Total Projects" value={stats.total} />
        <StatCard
          label="Complete"
          value={`${stats.complete} (${stats.pct}%)`}
          color="#5DBB97"
        />
        <StatCard
          label="Spent / Budget"
          value={`$${stats.totalCost.toLocaleString()} / $${stats.totalBudget.toLocaleString()}`}
          color={stats.totalCost > stats.totalBudget ? "#E5685B" : "#C49A50"}
        />
        <StatCard
          label="Total Hours"
          value={`${stats.totalHours}h`}
          color="#5B7BA8"
        />
      </div>

      <div className="nautical-card rounded-lg p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-parchment">
            Overall Progress
          </h3>
          <span className="text-brass font-mono text-[0.85rem]">
            {stats.pct}%
          </span>
        </div>
        <div
          style={{
            height: "12px",
            background: "rgba(244, 236, 216, 0.06)",
            borderRadius: "6px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${stats.pct}%`,
              background: "linear-gradient(90deg, #C49A50 0%, #D4AB60 100%)",
              transition: "width 0.5s ease",
            }}
          />
        </div>
        <div className="grid grid-cols-3 gap-2 mt-4 text-xs font-mono">
          <div
            className="flex items-center gap-1.5"
            style={{ color: "#D97706" }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: "#D97706" }}
            />
            <span>{stats.inProgress} in progress</span>
          </div>
          <div
            className="flex items-center gap-1.5"
            style={{ color: "#DC2626" }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: "#DC2626" }}
            />
            <span>{stats.blocked} blocked</span>
          </div>
          <div
            className="flex items-center gap-1.5"
            style={{ color: "#5DBB97" }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ background: "#5DBB97" }}
            />
            <span>{stats.complete} complete</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-parchment mb-3">
          By Zone — Budget Burn-down
        </h3>
        <div className="space-y-3">
          {stats.byZone.map((z) => (
            <ZoneRow
              key={z.id}
              zone={z}
              budget={meta.budgetByZone[z.id] ?? 0}
              onBudgetChange={(b) =>
                setMeta((prev) => ({
                  ...prev,
                  budgetByZone: { ...prev.budgetByZone, [z.id as ZoneId]: b },
                }))
              }
            />
          ))}
        </div>
      </div>
    </main>
  );
}
