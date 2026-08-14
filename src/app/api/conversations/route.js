import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Conversation from "@/models/Conversation";
import { getAuthUser } from "@/lib/auth";

// GET /api/conversations — Fetch conversations for current user from MongoDB Atlas
export async function GET(request) {
  try {
    const authUser = await getAuthUser(request);
    const userId = authUser?.userId || "guest";

    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ conversations: [], error: "MongoDB Atlas offline" });
    }

    const conversations = await Conversation.find({ userId }).sort({ updatedAt: -1 }).lean();
    return NextResponse.json({ conversations: conversations || [] });
  } catch (error) {
    console.warn("GET /api/conversations MongoDB error:", error.message);
    return NextResponse.json({ conversations: [], error: error.message });
  }
}

// POST /api/conversations — Save or update conversation directly in MongoDB Atlas
export async function POST(request) {
  try {
    const authUser = await getAuthUser(request);
    const userId = authUser?.userId || "guest";

    const body = await request.json();
    const { id, title, messages } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Conversation ID is required." },
        { status: 400 }
      );
    }

    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ success: false, error: "MongoDB Atlas offline" });
    }

    const updated = await Conversation.findOneAndUpdate(
      { id, userId },
      { 
        id, 
        userId,
        title: title || "New Conversation", 
        messages: messages || [],
        updatedAt: new Date() 
      },
      { upsert: true, returnDocument: 'after' }
    );

    return NextResponse.json({ success: true, conversation: updated });
  } catch (error) {
    console.warn("POST /api/conversations MongoDB error:", error.message);
    return NextResponse.json({ success: false, error: error.message });
  }
}

// DELETE /api/conversations — Delete all conversations for current user in MongoDB Atlas
export async function DELETE(request) {
  try {
    const authUser = await getAuthUser(request);
    const userId = authUser?.userId || "guest";

    const conn = await connectToDatabase();
    if (conn) {
      await Conversation.deleteMany({ userId });
    }

    return NextResponse.json({ success: true, message: "All conversations deleted from MongoDB Atlas." });
  } catch (error) {
    return NextResponse.json({ success: true });
  }
}
