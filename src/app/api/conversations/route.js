import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Conversation from "@/models/Conversation";
import { getAuthUser } from "@/lib/auth";

// GET /api/conversations — Fetch private conversations exclusively for authenticated user
export async function GET(request) {
  try {
    const authUser = await getAuthUser(request);
    
    // If user is logged out, return empty history (privacy protection)
    if (!authUser || !authUser.userId) {
      return NextResponse.json({ conversations: [] });
    }

    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ conversations: [], error: "MongoDB Atlas offline" });
    }

    const conversations = await Conversation.find({ userId: authUser.userId })
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json({ conversations: conversations || [] });
  } catch (error) {
    console.warn("GET /api/conversations MongoDB error:", error.message);
    return NextResponse.json({ conversations: [], error: error.message });
  }
}

// POST /api/conversations — Save or update conversation in MongoDB Atlas
export async function POST(request) {
  try {
    const authUser = await getAuthUser(request);
    
    // Only persist to cloud database for authenticated users
    if (!authUser || !authUser.userId) {
      return NextResponse.json({ success: true, isGuest: true });
    }

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
      { id, userId: authUser.userId },
      { 
        id, 
        userId: authUser.userId,
        title: title || "New Conversation", 
        messages: messages || [],
        updatedAt: new Date() 
      },
      { upsert: true, returnDocument: "after" }
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
    if (!authUser || !authUser.userId) {
      return NextResponse.json({ success: true });
    }

    const conn = await connectToDatabase();
    if (conn) {
      await Conversation.deleteMany({ userId: authUser.userId });
    }

    return NextResponse.json({ success: true, message: "All conversations deleted from MongoDB Atlas." });
  } catch (error) {
    return NextResponse.json({ success: true });
  }
}
