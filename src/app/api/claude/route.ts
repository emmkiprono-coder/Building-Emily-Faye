import { NextResponse } from "next/server";

interface RequestBody {
  prompt: string;
  systemPrompt?: string;
  jsonMode?: boolean;
  image?: { mediaType: string; data: string };
  images?: { label?: string; image: { mediaType: string; data: string } }[];
  maxTokens?: number;
}

interface AnthropicMessageContent {
  type: "text" | "image";
  text?: string;
  source?: { type: "base64"; media_type: string; data: string };
}

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "ANTHROPIC_API_KEY is not set. Add it to .env.local or your Vercel environment variables.",
      },
      { status: 500 }
    );
  }

  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.prompt || typeof body.prompt !== "string") {
    return NextResponse.json(
      { error: "prompt is required" },
      { status: 400 }
    );
  }

  // Build content blocks
  const content: AnthropicMessageContent[] = [];
  if (body.images && body.images.length > 0) {
    for (const item of body.images) {
      if (item.label) content.push({ type: "text", text: item.label });
      content.push({
        type: "image",
        source: {
          type: "base64",
          media_type: item.image.mediaType,
          data: item.image.data,
        },
      });
    }
    content.push({ type: "text", text: body.prompt });
  } else if (body.image) {
    content.push({
      type: "image",
      source: {
        type: "base64",
        media_type: body.image.mediaType,
        data: body.image.data,
      },
    });
    content.push({ type: "text", text: body.prompt });
  } else {
    content.push({ type: "text", text: body.prompt });
  }

  const anthropicBody: Record<string, unknown> = {
    model: "claude-sonnet-4-20250514",
    max_tokens: body.maxTokens ?? 1500,
    messages: [{ role: "user", content }],
  };
  if (body.systemPrompt) anthropicBody.system = body.systemPrompt;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(anthropicBody),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return NextResponse.json(
        { error: `Anthropic API error ${res.status}: ${errText}` },
        { status: res.status }
      );
    }

    const data = (await res.json()) as {
      content: { type: string; text?: string }[];
    };
    const text = data.content
      .filter((b) => b.type === "text" && typeof b.text === "string")
      .map((b) => b.text as string)
      .join("\n");

    return NextResponse.json({ text });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Request failed: ${message}` },
      { status: 500 }
    );
  }
}
