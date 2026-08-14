import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid JSON in request body." },
        { status: 400 }
      );
    }

    const { messages, model, systemInstruction, customApiKey } = body;

    const apiKey = (customApiKey || process.env.GEMINI_API_KEY || "").trim();

    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE") {
      return NextResponse.json(
        {
          error: "Gemini API Key is missing. Please click Settings (⚙️) in the top-right to enter your key, or add it to .env.local.",
          isKeyMissing: true,
        },
        { status: 401 }
      );
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "Messages array is required." },
        { status: 400 }
      );
    }

    const validMessages = messages.filter((m) => m && m.content && m.content.trim() !== "");

    if (validMessages.length === 0) {
      return NextResponse.json(
        { error: "Message content cannot be empty." },
        { status: 400 }
      );
    }

    // Format conversation history for Gemini multi-turn
    const formattedContents = validMessages.map((msg) => ({
      role: msg.role === "assistant" || msg.role === "model" ? "model" : "user",
      parts: [{ text: msg.content.trim() }],
    }));

    const config = {};
    if (systemInstruction && systemInstruction.trim()) {
      config.systemInstruction = systemInstruction.trim();
    }

    const ai = new GoogleGenAI({ apiKey });

    // Active high-throughput models with confirmed available quota
    const modelsToTry = [
      "gemini-flash-lite-latest",
      "gemini-3.5-flash-lite",
      "gemini-3.6-flash",
      "gemini-3.1-flash-lite",
      "gemma-4-31b-it",
      model,
    ].filter((v, i, a) => Boolean(v) && a.indexOf(v) === i);

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        let streamSuccess = false;
        let isClosed = false;

        const safeEnqueue = (text) => {
          if (isClosed || !text) return;
          try {
            controller.enqueue(encoder.encode(text));
          } catch (err) {
            isClosed = true;
          }
        };

        const safeClose = () => {
          if (isClosed) return;
          isClosed = true;
          try {
            controller.close();
          } catch (err) {}
        };

        // Try streaming across active quota models
        for (const m of modelsToTry) {
          if (isClosed) break;
          try {
            const responseStream = await ai.models.generateContentStream({
              model: m,
              contents: formattedContents,
              config,
            });

            for await (const chunk of responseStream) {
              if (isClosed) break;
              const text = chunk.text || "";
              if (text) {
                safeEnqueue(text);
                streamSuccess = true;
              }
            }

            if (streamSuccess) break;
          } catch (err) {
            console.warn(`Model ${m} notice:`, err.message);
          }
        }

        // Non-streaming fallback if stream was interrupted
        if (!streamSuccess && !isClosed) {
          for (const m of modelsToTry) {
            try {
              const staticRes = await ai.models.generateContent({
                model: m,
                contents: formattedContents,
                config,
              });

              if (staticRes && staticRes.text) {
                safeEnqueue(staticRes.text);
                streamSuccess = true;
                break;
              }
            } catch (e2) {
              console.warn(`Static fallback notice on ${m}:`, e2.message);
            }
          }
        }

        if (!streamSuccess && !isClosed) {
          safeEnqueue(
            "I apologize, but all free-tier API quotas are temporarily busy. Please wait 15 seconds or provide your own Gemini API key in Settings (⚙️)."
          );
        }

        safeClose();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    console.error("Yash AI Route Error:", error);

    const errorMessage = error?.message || "An unexpected error occurred.";
    let friendlyMessage = errorMessage;

    if (errorMessage.includes("API_KEY_INVALID") || errorMessage.includes("API key not valid")) {
      friendlyMessage = "Your Gemini API Key is invalid. Please verify your key in Settings (⚙️).";
    } else if (errorMessage.includes("RESOURCE_EXHAUSTED") || errorMessage.includes("429")) {
      friendlyMessage = "Google API free tier quota limit reached. Please retry in a few seconds.";
    }

    return NextResponse.json(
      { error: friendlyMessage, raw: errorMessage },
      { status: 500 }
    );
  }
}
