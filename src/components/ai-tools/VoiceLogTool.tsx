"use client";

import { Loader2, Mic, MicOff, Wand2 } from "lucide-react";
import { useRef, useState } from "react";
import { callClaudeJson } from "@/lib/claude";
import type { Project } from "@/types/project";

interface ParsedLog {
  assignee: string | null;
  hoursSpent: number | null;
  cost: number | null;
  workCompleted: string | null;
  parts: string[] | null;
  newStatus: "in_progress" | "complete" | "blocked" | null;
  notes: string | null;
}

// Speech recognition browser API typing (loose, as it varies)
type WindowWithSR = Window & {
  SpeechRecognition?: new () => SpeechRecognitionLike;
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
};
interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void;
  onerror: (e: { error: string }) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

interface Props {
  project: Project;
  onUpdate: (updates: Partial<Project>) => void;
  onClose: () => void;
}

export function VoiceLogTool({ project, onUpdate, onClose }: Props) {
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [textInput, setTextInput] = useState("");
  const [parsing, setParsing] = useState(false);
  const [result, setResult] = useState<ParsedLog | null>(null);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);

  const speechSupported =
    typeof window !== "undefined" &&
    Boolean(
      (window as WindowWithSR).SpeechRecognition ||
        (window as WindowWithSR).webkitSpeechRecognition
    );

  const startRecording = () => {
    if (!speechSupported) {
      setError(
        "Speech recognition not supported in this browser. Use the text box below."
      );
      return;
    }
    const w = window as WindowWithSR;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition!;
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";
    rec.onresult = (e) => {
      let txt = "";
      for (let i = 0; i < e.results.length; i++) {
        txt += e.results[i][0].transcript + " ";
      }
      setTranscript(txt.trim());
    };
    rec.onerror = (e) => setError("Mic error: " + e.error);
    rec.onend = () => setRecording(false);
    rec.start();
    recognitionRef.current = rec;
    setRecording(true);
    setError(null);
  };

  const stopRecording = () => {
    recognitionRef.current?.stop();
    setRecording(false);
  };

  const parse = async () => {
    const input = transcript || textInput;
    if (!input.trim()) return;
    setParsing(true);
    setError(null);
    try {
      const parsed = await callClaudeJson<ParsedLog>(
        `Parse this work-log dictation into structured fields for the project "${project.title}" (${project.description}).

Dictation: "${input}"

Return ONLY a JSON object with these keys (use null for unmentioned fields):
{
  "assignee": string or null,
  "hoursSpent": number or null,
  "cost": number or null,
  "workCompleted": string or null,
  "parts": array of strings or null,
  "newStatus": "in_progress" | "complete" | "blocked" | null,
  "notes": string or null
}`,
        { maxTokens: 800 }
      );
      setResult(parsed);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError("Parse failed: " + msg);
    } finally {
      setParsing(false);
    }
  };

  const apply = () => {
    if (!result) return;
    const updates: Partial<Project> = {};
    if (result.assignee) updates.assignee = result.assignee;
    if (result.hoursSpent != null)
      updates.hoursSpent = (project.hoursSpent || 0) + Number(result.hoursSpent);
    if (result.cost != null)
      updates.cost = (project.cost || 0) + Number(result.cost);
    if (result.workCompleted)
      updates.workCompleted = project.workCompleted
        ? `${project.workCompleted}\n\n${result.workCompleted}`
        : result.workCompleted;
    if (result.parts && result.parts.length) {
      const newParts = result.parts.map((name) => ({
        id: Date.now() + Math.floor(Math.random() * 1000),
        name,
      }));
      updates.parts = [...(project.parts || []), ...newParts];
    }
    if (result.newStatus) updates.status = result.newStatus;
    if (result.notes)
      updates.notes = project.notes
        ? `${project.notes}\n\n${result.notes}`
        : result.notes;
    onUpdate(updates);
    onClose();
  };

  return (
    <div className="space-y-3">
      <p className="text-xs text-sand">
        Talk through what you did. Claude will extract hours, cost, parts, and
        status.
      </p>
      {speechSupported && (
        <div className="flex gap-2">
          {!recording ? (
            <button
              onClick={startRecording}
              className="brass-button px-3 py-2 rounded-lg text-sm flex items-center gap-2"
            >
              <Mic size={14} /> Start recording
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="px-3 py-2 rounded-lg text-sm flex items-center gap-2 pulse-soft"
              style={{ background: "#E5685B", color: "#0F1B2C", fontWeight: 600 }}
            >
              <MicOff size={14} /> Stop ({transcript.length} chars)
            </button>
          )}
        </div>
      )}
      <textarea
        value={transcript || textInput}
        onChange={(e) => {
          setTranscript("");
          setTextInput(e.target.value);
        }}
        rows={4}
        placeholder="Or type/paste a free-form work log here..."
        className="w-full px-3 py-2 rounded-lg text-sm input-field"
      />
      <button
        onClick={parse}
        disabled={parsing || (!transcript && !textInput)}
        className="brass-button px-3 py-2 rounded-lg text-sm flex items-center gap-2"
      >
        {parsing ? <Loader2 size={14} className="spin" /> : <Wand2 size={14} />}
        Parse
      </button>
      {error && <p className="text-xs text-coral">{error}</p>}
      {result && (
        <div
          className="p-3 rounded-lg space-y-2 text-xs text-parchment"
          style={{ background: "rgba(0, 0, 0, 0.2)" }}
        >
          {result.assignee && (
            <div>
              <strong>Assignee:</strong> {result.assignee}
            </div>
          )}
          {result.hoursSpent != null && (
            <div>
              <strong>+ Hours:</strong> {result.hoursSpent}
            </div>
          )}
          {result.cost != null && (
            <div>
              <strong>+ Cost:</strong> ${result.cost}
            </div>
          )}
          {result.workCompleted && (
            <div>
              <strong>Work:</strong> {result.workCompleted}
            </div>
          )}
          {result.parts && result.parts.length > 0 && (
            <div>
              <strong>Parts:</strong> {result.parts.join(", ")}
            </div>
          )}
          {result.newStatus && (
            <div>
              <strong>Status:</strong> {result.newStatus}
            </div>
          )}
          {result.notes && (
            <div>
              <strong>Notes:</strong> {result.notes}
            </div>
          )}
          <button
            onClick={apply}
            className="brass-button px-3 py-1.5 rounded text-xs mt-2"
          >
            Apply to project
          </button>
        </div>
      )}
    </div>
  );
}
