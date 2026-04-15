import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { prompt, apiKey } = await req.json();

  if (!apiKey) {
    return NextResponse.json(
      "API key is required. Please add your key in Settings.",
      { status: 400 }
    );
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 4096,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      return NextResponse.json(
        err?.error?.message || "API request failed",
        { status: response.status }
      );
    }

    const result = await response.json();
    const text = result.content?.[0]?.text || "";

    // Parse JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json("Failed to parse lesson from AI response", {
        status: 500,
      });
    }

    const lesson = JSON.parse(jsonMatch[0]);
    return NextResponse.json(lesson);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(message, { status: 500 });
  }
}
