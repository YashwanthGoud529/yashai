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

    const { messages, model = "gemini-flash-latest", systemInstruction, customApiKey } = body;

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

    const ai = new GoogleGenAI({ apiKey });

    // Format conversation history for Gemini multi-turn
    const formattedContents = validMessages.map((msg) => ({
      role: msg.role === "assistant" || msg.role === "model" ? "model" : "user",
      parts: [{ text: msg.content.trim() }],
    }));

    const config = {};
    if (systemInstruction && systemInstruction.trim()) {
      config.systemInstruction = systemInstruction.trim();
    }

    // List of models to try in order of preference
    const requestedModel = model || "gemini-flash-latest";
    const modelsToTry = [
      requestedModel,
      "gemini-flash-latest",
      "gemini-3.7-flash",
      "gemini-3.5-flash",
    ].filter((v, i, a) => a.indexOf(v) === i); // deduplicate

    let replyText = "";
    let modelUsed = requestedModel;
    let lastError = null;

    for (const m of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: m,
          contents: formattedContents,
          config,
        });

        replyText = response.text || "";
        modelUsed = m;
        lastError = null;
        break; // Success!
      } catch (err) {
        console.warn(`Model ${m} failed:`, err.message);
        lastError = err;
      }
    }

    if (lastError && !replyText) {
      throw lastError;
    }

    return NextResponse.json({
      reply: replyText || "I received your message, but no text response was produced.",
      modelUsed,
    });
  } catch (error) {
    console.error("Gemini API Route Error:", error);

    const errorMessage = error?.message || "An unexpected error occurred.";
    let friendlyMessage = errorMessage;

    if (errorMessage.includes("API_KEY_INVALID") || errorMessage.includes("API key not valid")) {
      friendlyMessage = "Your Gemini API Key is invalid. Please verify the key in Settings (⚙️) from Google AI Studio.";
    } else if (errorMessage.includes("RESOURCE_EXHAUSTED") || errorMessage.includes("429")) {
      friendlyMessage = "Free tier quota exceeded or rate limited. Please wait a few seconds and try again.";
    }

    return NextResponse.json(
      { error: friendlyMessage, raw: errorMessage },
      { status: 500 }
    );
  }
}
