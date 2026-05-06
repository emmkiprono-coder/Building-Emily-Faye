"use client";

import {
  Activity,
  Calendar,
  Cloud,
  Download,
  FileText,
  Link2,
  Mail,
  MessageSquare,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";
import type { DeadlineInfo, OverallStats } from "@/lib/compute";
import type { InventoryItem, Meta, Project, Zone } from "@/types/project";
import { ToolButton } from "./primitives";
import { StandupTool } from "./agentic-tools/StandupTool";
import { WeatherTool } from "./agentic-tools/WeatherTool";
import { ReceiptTool } from "./agentic-tools/ReceiptTool";
import {
  CalendarExportTool,
  DriveSyncTool,
  PartsEmailTool,
  PublicPageTool,
  ReportTool,
  SlackTool,
} from "./agentic-tools/OtherTools";

type AgenticView =
  | "home"
  | "standup"
  | "weather"
  | "receipt"
  | "email"
  | "slack"
  | "report"
  | "calendar"
  | "drive"
  | "page";

interface AgenticPanelProps {
  onClose: () => void;
  projects: Project[];
  zones: Zone[];
  stats: OverallStats;
  deadline: DeadlineInfo;
  meta: Meta;
  setMeta: (updater: (prev: Meta) => Meta) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  setInventory: (
    updater: (prev: InventoryItem[]) => InventoryItem[]
  ) => void;
}

export function AgenticPanel({
  onClose,
  projects,
  zones,
  stats,
  deadline,
  meta,
  setMeta,
  updateProject,
  setInventory,
}: AgenticPanelProps) {
  const [view, setView] = useState<AgenticView>("home");

  return (
    <div
      className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-0 sm:p-4 fade-in"
      style={{
        background: "rgba(15, 27, 44, 0.85)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        className="w-full sm:max-w-2xl max-h-[95vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl scrollbar-thin"
        style={{
          background: "linear-gradient(180deg, #1A2A40 0%, #14253A 100%)",
          border: "1px solid rgba(196, 154, 80, 0.3)",
        }}
      >
        <div
          className="sticky top-0 z-10 px-4 sm:px-6 py-4 flex items-center justify-between"
          style={{
            background:
              "linear-gradient(180deg, #1A2A40 0%, rgba(26, 42, 64, 0.95) 100%)",
            borderBottom: "1px solid rgba(196, 154, 80, 0.2)",
            backdropFilter: "blur(8px)",
          }}
        >
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-brass" />
            <h2 className="text-base font-semibold text-parchment">
              AI Assistant
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-full flex items-center justify-center text-parchment"
            style={{ background: "rgba(244, 236, 216, 0.06)" }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-4 sm:p-6">
          {view !== "home" && (
            <button
              onClick={() => setView("home")}
              className="text-xs mb-4 text-brass"
            >
              ← Back to tools
            </button>
          )}

          {view === "home" && (
            <div className="space-y-2">
              <ToolButton
                icon={<Activity size={18} />}
                label="Daily standup"
                desc="Yesterday / today / blockers"
                onClick={() => setView("standup")}
              />
              <ToolButton
                icon={<Cloud size={18} />}
                label="Weather forecast"
                desc="Live NOAA for Montrose Harbor"
                onClick={() => setView("weather")}
              />
              <ToolButton
                icon={<Sparkles size={18} />}
                label="Receipt scanner"
                desc="Snap a receipt, auto-log to project"
                onClick={() => setView("receipt")}
              />
              <ToolButton
                icon={<Mail size={18} />}
                label="Parts order email"
                desc="Draft inquiry to West Marine etc."
                onClick={() => setView("email")}
              />
              <ToolButton
                icon={<MessageSquare size={18} />}
                label="Crew Slack update"
                desc="Hype the team with progress"
                onClick={() => setView("slack")}
              />
              <ToolButton
                icon={<FileText size={18} />}
                label="End-of-season report"
                desc="Full restoration narrative"
                onClick={() => setView("report")}
              />
              <ToolButton
                icon={<Calendar size={18} />}
                label="Calendar export"
                desc=".ics with all dated projects"
                onClick={() => setView("calendar")}
              />
              <ToolButton
                icon={<Download size={18} />}
                label="Google Drive sync"
                desc="Manual export instructions"
                onClick={() => setView("drive")}
              />
              <ToolButton
                icon={<Link2 size={18} />}
                label="Public progress page"
                desc="HTML for tmark-site.vercel.app"
                onClick={() => setView("page")}
              />
            </div>
          )}

          {view === "standup" && (
            <StandupTool projects={projects} deadline={deadline} />
          )}
          {view === "weather" && <WeatherTool meta={meta} setMeta={setMeta} />}
          {view === "receipt" && (
            <ReceiptTool
              projects={projects}
              zones={zones}
              updateProject={updateProject}
              setInventory={setInventory}
            />
          )}
          {view === "email" && <PartsEmailTool projects={projects} zones={zones} />}
          {view === "slack" && (
            <SlackTool
              projects={projects}
              stats={stats}
              deadline={deadline}
            />
          )}
          {view === "report" && (
            <ReportTool projects={projects} stats={stats} zones={zones} />
          )}
          {view === "calendar" && (
            <CalendarExportTool projects={projects} zones={zones} />
          )}
          {view === "drive" && <DriveSyncTool />}
          {view === "page" && (
            <PublicPageTool
              projects={projects}
              stats={stats}
              deadline={deadline}
            />
          )}
        </div>
      </div>
    </div>
  );
}
