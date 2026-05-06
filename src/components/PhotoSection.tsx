"use client";

import { Camera, Video, X } from "lucide-react";
import { useRef } from "react";
import type { MediaFile } from "@/types/project";
import { Label } from "./primitives";

interface PhotoSectionProps {
  label: string;
  files: MediaFile[];
  onAdd: (files: FileList) => void;
  onRemove: (id: string) => void;
  accept: string;
  isVideo?: boolean;
}

export function PhotoSection({
  label,
  files,
  onAdd,
  onRemove,
  accept,
  isVideo,
}: PhotoSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <Label>{label}</Label>
        <button
          onClick={() => inputRef.current?.click()}
          className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5"
          style={{
            background: "rgba(196, 154, 80, 0.1)",
            color: "#C49A50",
            border: "1px solid rgba(196, 154, 80, 0.3)",
          }}
        >
          {isVideo ? <Video size={12} /> : <Camera size={12} />} Add
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple
          className="hidden"
          onChange={(e) => e.target.files && onAdd(e.target.files)}
        />
      </div>
      {files.length === 0 ? (
        <div
          className="text-xs italic px-3 py-3 rounded-lg text-center text-sand"
          style={{
            background: "rgba(244, 236, 216, 0.02)",
            border: "1px dashed rgba(196, 154, 80, 0.2)",
          }}
        >
          No {isVideo ? "videos" : "photos"} yet.
        </div>
      ) : (
        <div
          className="grid gap-2"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
          }}
        >
          {files.map((f) => (
            <div
              key={f.id}
              className="relative rounded-lg overflow-hidden"
              style={{
                aspectRatio: "1",
                background: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(196, 154, 80, 0.2)",
              }}
            >
              {isVideo ? (
                <video
                  src={f.dataUrl}
                  controls
                  className="w-full h-full object-cover"
                />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={f.dataUrl}
                  alt={f.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}
              <button
                onClick={() => onRemove(f.id)}
                className="absolute top-1 right-1 w-6 h-6 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(15, 27, 44, 0.8)",
                  color: "#E5685B",
                }}
                aria-label={`Remove ${f.name}`}
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
