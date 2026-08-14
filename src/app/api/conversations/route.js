import { NextResponse } from "next/server";
import { connectToDatabase } from "../../../lib/mongodb";
import Conversation from "../../../models/Conversation";

// GET /api/conversations — Fetch all conversations
export async function GET() {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ conversations: [], isOffline: true });
    }

    const conversations = await Conversation.find({}).sort({ updatedAt: -1 }).lean();
    return NextResponse.json({ conversations: conversations || [] });
  } catch (error) {
    console.warn("GET /api/conversations fallback:", error.message);
    return NextResponse.json({ conversations: [], isOffline: true });
  }
}

// POST /api/conversations — Save or update conversation
export async function POST(request) {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ success: true, isOffline: true });
    }

    const body = await request.json();
    const { id, title, messages } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Conversation ID is required." },
        { status: 400 }
      );
    }

    const updated = await Conversation.findOneAndUpdate(
      { id },
      { 
        id, 
        title: title || "New Conversation", 
        messages: messages || [],
        updatedAt: new Date() 
      },
      { upsert: true, returnDocument: 'after' }
    );

    return NextResponse.json({ success: true, conversation: updated });
  } catch (error) {
    console.warn("POST /api/conversations fallback:", error.message);
    return NextResponse.json({ success: true, isOffline: true });
  }
}

// DELETE /api/conversations — Delete all conversations
export async function DELETE() {
  try {
    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ success: true });
    }

    await Conversation.deleteMany({});
    return NextResponse.json({ success: true, message: "All conversations deleted." });
  } catch (error) {
    console.warn("DELETE /api/conversations fallback:", error.message);
    return NextResponse.json({ success: true });
  }
}
