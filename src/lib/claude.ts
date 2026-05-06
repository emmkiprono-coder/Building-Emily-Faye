/**
 * Client-side wrapper for Claude API.
 * Calls /api/claude (our Next.js server route) so the API key never leaves the server.
 */

export interface ClaudeImage {
  mediaType: string;
  data: string;
}

export interface CallClaudeOptions {
  systemPrompt?: string;
  jsonMode?: boolean;
  image?: ClaudeImage;
  images?: { label?: string; image: ClaudeImage }[];
  maxTokens?: number;
}

export async function callClaude(
  prompt: string,
  options: CallClaudeOptions = {}
): Promise<string> {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, ...options }),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Claude API error ${res.status}: ${errText}`);
  }
  const data = await res.json();
  return data.text as string;
}

export async function callClaudeJson<T = unknown>(
  prompt: string,
  options: Omit<CallClaudeOptions, "jsonMode"> = {}
): Promise<T> {
  const text = await callClaude(prompt, { ...options, jsonMode: true });
  const cleaned = text.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned) as T;
}
