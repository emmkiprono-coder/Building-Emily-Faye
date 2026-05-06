"use client";

import { Calendar, Cloud, Download, Link2, Loader2, Mail, MessageSquare } from "lucide-react";
import { useState } from "react";
import { callClaude } from "@/lib/claude";
import { ZONES } from "@/data/constants";
import type { DeadlineInfo, OverallStats } from "@/lib/compute";
import type { Project, ZoneId } from "@/types/project";

// ============ Parts Order Email ============
export function PartsEmailTool({ projects }: { projects: Project[] }) {
  const [selectedZone, setSelectedZone] = useState<ZoneId | "all">("all");
  const [vendor, setVendor] = useState("West Marine");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const filtered =
        selectedZone === "all"
          ? projects
          : projects.filter((p) => p.zone === selectedZone);
      const allParts = filtered.flatMap((p) =>
        (p.parts || []).map((part) => ({ part: part.name, project: p.title }))
      );
      if (allParts.length === 0) {
        setOutput("(No parts logged for this scope yet.)");
        return;
      }
      const result = await callClaude(
        `Draft a professional parts inquiry email to ${vendor} from Emmanuel Chepkwony, captain of TMarK Charters in Chicago. The boat is a 1979 C&C 29 sailboat (Emily Faye). I need pricing and availability for these items:

${allParts.map((p) => `- ${p.part} (for: ${p.project})`).join("\n")}

Subject + body. Professional but friendly. No em-dashes. Brief.`,
        { maxTokens: 1000 }
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
      <h3 className="text-base font-semibold text-parchment">
        Parts Order Email
      </h3>
      <div className="grid grid-cols-2 gap-2">
        <select
          value={selectedZone}
          onChange={(e) =>
            setSelectedZone(e.target.value as ZoneId | "all")
          }
          className="px-3 py-2 rounded text-sm input-field"
        >
          <option value="all">All zones</option>
          {ZONES.map((z) => (
            <option key={z.id} value={z.id}>
              {z.short}
            </option>
          ))}
        </select>
        <input
          value={vendor}
          onChange={(e) => setVendor(e.target.value)}
          placeholder="Vendor"
          className="px-3 py-2 rounded text-sm input-field"
        />
      </div>
      <button
        onClick={generate}
        disabled={loading}
        className="brass-button px-4 py-2 rounded-lg text-sm flex items-center gap-2"
      >
        {loading ? <Loader2 size={14} className="spin" /> : <Mail size={14} />}
        Draft email
      </button>
      {error && <p className="text-xs text-coral">{error}</p>}
      {output && (
        <div
          className="p-4 rounded-lg whitespace-pre-wrap text-sm text-parchment"
          style={{ background: "rgba(0, 0, 0, 0.2)" }}
        >
          {output}
          <button
            onClick={() => navigator.clipboard.writeText(output)}
            className="brass-button px-3 py-1.5 rounded text-xs mt-3"
          >
            Copy
          </button>
        </div>
      )}
    </div>
  );
}

// ============ Slack Update ============
export function SlackTool({
  projects,
  stats,
  deadline,
}: {
  projects: Project[];
  stats: OverallStats;
  deadline: DeadlineInfo;
}) {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [tone, setTone] = useState("hype");
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const recentComplete = projects
        .filter((p) => p.status === "complete")
        .slice(-5);
      const inProgress = projects
        .filter((p) => p.status === "in_progress")
        .slice(0, 5);
      const result = await callClaude(
        `Write a Slack-ready crew update for the TMarK Charters team about Emily Faye restoration progress. Tone: ${tone}.

Stats: ${stats.complete}/${stats.total} done (${stats.pct}%), $${stats.totalCost} spent, ${deadline.daysRemaining} days to July 4 launch.

Recent completes: ${recentComplete.map((p) => p.title).join(", ") || "none yet"}
In progress: ${inProgress.map((p) => p.title).join(", ") || "none"}

Slack-ready (use *bold* and bullet points). Brief, no em-dashes.`,
        { maxTokens: 600 }
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
      <h3 className="text-base font-semibold text-parchment">
        Crew Slack Update
      </h3>
      <select
        value={tone}
        onChange={(e) => setTone(e.target.value)}
        className="px-3 py-2 rounded text-sm w-full input-field"
      >
        <option value="hype">Hype / energetic</option>
        <option value="professional">Professional</option>
        <option value="casual">Casual</option>
      </select>
      <button
        onClick={generate}
        disabled={loading}
        className="brass-button px-4 py-2 rounded-lg text-sm flex items-center gap-2"
      >
        {loading ? (
          <Loader2 size={14} className="spin" />
        ) : (
          <MessageSquare size={14} />
        )}
        Draft message
      </button>
      {error && <p className="text-xs text-coral">{error}</p>}
      {output && (
        <div
          className="p-4 rounded-lg whitespace-pre-wrap text-sm text-parchment"
          style={{ background: "rgba(0, 0, 0, 0.2)" }}
        >
          {output}
          <button
            onClick={() => navigator.clipboard.writeText(output)}
            className="brass-button px-3 py-1.5 rounded text-xs mt-3"
          >
            Copy
          </button>
        </div>
      )}
    </div>
  );
}

// ============ End-of-Season Report ============
export function ReportTool({
  projects,
  stats,
}: {
  projects: Project[];
  stats: OverallStats;
}) {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const completeProjects = projects.filter((p) => p.status === "complete");
      const summary = completeProjects.map((p) => ({
        zone: ZONES.find((z) => z.id === p.zone)?.short,
        title: p.title,
        workCompleted: p.workCompleted,
        cost: p.cost,
        hours: p.hoursSpent,
        assignee: p.assignee,
        parts: (p.parts || []).map((pt) => pt.name),
      }));
      const result = await callClaude(
        `Write a comprehensive end-of-season restoration report for Emily Faye, a 1979 C&C 29 sailboat owned by TMarK Charters. The restoration culminated in the July 4, 2026 Airbnb dock-stay launch at Montrose Harbor.

Stats: ${stats.complete} projects complete, $${stats.totalCost} total spent, ${stats.totalHours} hours of work.

Completed work:
${JSON.stringify(summary, null, 2)}

Sections: Executive Summary, Zone-by-zone work completed, Cost breakdown, Lessons learned, Looking ahead. Markdown formatted. Professional but warm. No em-dashes.`,
        { maxTokens: 4000 }
      );
      setOutput(result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `emily_faye_report_${new Date().toISOString().split("T")[0]}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-parchment">
        End-of-Season Report
      </h3>
      {!output && (
        <button
          onClick={generate}
          disabled={loading}
          className="brass-button px-4 py-2 rounded-lg text-sm flex items-center gap-2"
        >
          {loading ? (
            <Loader2 size={14} className="spin" />
          ) : (
            <Download size={14} />
          )}
          Generate full report
        </button>
      )}
      {error && <p className="text-xs text-coral">{error}</p>}
      {output && (
        <div className="space-y-2">
          <div
            className="p-4 rounded-lg whitespace-pre-wrap text-sm max-h-96 overflow-y-auto scrollbar-thin text-parchment"
            style={{ background: "rgba(0, 0, 0, 0.2)" }}
          >
            {output}
          </div>
          <div className="flex gap-2">
            <button
              onClick={download}
              className="brass-button px-3 py-1.5 rounded text-xs flex items-center gap-1"
            >
              <Download size={12} /> Download .md
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              className="brass-button px-3 py-1.5 rounded text-xs"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============ Calendar Export ============
export function CalendarExportTool({ projects }: { projects: Project[] }) {
  const generate = () => {
    const events = projects.filter((p) => p.startDate && p.endDate);
    if (events.length === 0) {
      alert("No projects have both start and end dates set.");
      return;
    }
    const ics = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Emily Faye Restoration//EN",
      ...events.flatMap((p) => {
        const zone = ZONES.find((z) => z.id === p.zone);
        return [
          "BEGIN:VEVENT",
          `UID:${p.id}@emilyfaye`,
          `DTSTART;VALUE=DATE:${p.startDate.replace(/-/g, "")}`,
          `DTEND;VALUE=DATE:${p.endDate.replace(/-/g, "")}`,
          `SUMMARY:[${zone?.short ?? ""}] ${p.title}`,
          `DESCRIPTION:${(p.description || "").replace(/\n/g, "\\n")}`,
          `STATUS:${p.status === "complete" ? "CONFIRMED" : "TENTATIVE"}`,
          "END:VEVENT",
        ];
      }),
      "END:VCALENDAR",
    ].join("\r\n");
    const blob = new Blob([ics], { type: "text/calendar" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "emily_faye_calendar.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-parchment">
        Calendar Export
      </h3>
      <p className="text-sm text-sand">
        Generates a .ics file with every project that has both start and end
        dates. Import into Google Calendar, Apple Calendar, etc.
      </p>
      <button
        onClick={generate}
        className="brass-button px-4 py-2 rounded-lg text-sm flex items-center gap-2"
      >
        <Calendar size={14} /> Download .ics file
      </button>
    </div>
  );
}

// ============ Drive Sync (instructions) ============
export function DriveSyncTool() {
  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-parchment">
        Google Drive Sync
      </h3>
      <p className="text-sm text-sand">
        Photos currently live in your browser storage. To push them to Google
        Drive, you can:
      </p>
      <ol
        className="text-sm space-y-2 pl-5 text-parchment"
        style={{ listStyleType: "decimal" }}
      >
        <li>
          Use the <strong>Export</strong> button in the header to download all
          data as JSON.
        </li>
        <li>
          Open this artifact in a Claude conversation where Google Drive is
          connected.
        </li>
        <li>
          Ask Claude to upload the JSON to your{" "}
          <code className="bg-black/30 px-1 rounded">
            Emily Faye Restoration
          </code>{" "}
          folder.
        </li>
        <li>
          For full automated sync, this would need a server-side integration
          using the Drive API.
        </li>
      </ol>
      <p className="text-xs italic text-sand">
        Browser sandboxing prevents direct Drive uploads from artifacts, so
        this is a manual step for now.
      </p>
    </div>
  );
}

// ============ Public Page ============
export function PublicPageTool({
  projects,
  stats,
  deadline,
}: {
  projects: Project[];
  stats: OverallStats;
  deadline: DeadlineInfo;
}) {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const completed = projects.filter((p) => p.status === "complete");
      const completedWithPhotos = completed.filter(
        (p) => p.afterPhotos.length > 0
      );
      const result = await callClaude(
        `Generate a single-file HTML page (with inline CSS) for tmark-site.vercel.app that publicly showcases the Emily Faye restoration progress. Building anticipation for the July 4, 2026 Airbnb dock-stay launch.

Brand: TMarK Charters, Chicago waterfront, Montrose Harbor.
Boat: 1979 C&C 29 sailboat named Emily Faye.

Stats: ${stats.complete}/${stats.total} projects done, ${deadline.daysRemaining} days to launch.

Completed projects with photos: ${completedWithPhotos.length}
Recent completed work: ${completed
          .slice(-8)
          .map((p) => `"${p.title}"`)
          .join(", ")}

Output a complete <!DOCTYPE html> single-file page. Mobile-first, beautiful nautical aesthetic (deep navy, brass, parchment), no external dependencies except Google Fonts. Hero with countdown to July 4 2026, progress bar, "Recently Completed" section, "Coming Soon" teaser. End with email capture. NO em-dashes anywhere.

Just the HTML.`,
        { maxTokens: 4000 }
      );
      const cleaned = result.replace(/```html|```/g, "").trim();
      setOutput(cleaned);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "emily_faye_progress.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-parchment">
        Public Progress Page
      </h3>
      {!output && (
        <button
          onClick={generate}
          disabled={loading}
          className="brass-button px-4 py-2 rounded-lg text-sm flex items-center gap-2"
        >
          {loading ? (
            <Loader2 size={14} className="spin" />
          ) : (
            <Link2 size={14} />
          )}
          Generate HTML page
        </button>
      )}
      {error && <p className="text-xs text-coral">{error}</p>}
      {output && (
        <div className="space-y-2">
          <p className="text-xs text-sand">
            Generated {(output.length / 1024).toFixed(1)} KB. Drop in
            tmark-site/public/.
          </p>
          <div className="flex gap-2">
            <button
              onClick={download}
              className="brass-button px-3 py-1.5 rounded text-xs flex items-center gap-1"
            >
              <Download size={12} /> Download .html
            </button>
            <button
              onClick={() => navigator.clipboard.writeText(output)}
              className="brass-button px-3 py-1.5 rounded text-xs"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export { Cloud };
