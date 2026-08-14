import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Conversation from "@/models/Conversation";
import { getAuthUser } from "@/lib/auth";
import { readLocalData, writeLocalData } from "@/lib/localStore";

// GET /api/conversations — Fetch conversations for current user
export async function GET(request) {
  try {
    const authUser = await getAuthUser(request);
    const userId = authUser?.userId || "guest";

    const conn = await connectToDatabase();
    if (conn) {
      const conversations = await Conversation.find({ userId }).sort({ updatedAt: -1 }).lean();
      return NextResponse.json({ conversations: conversations || [] });
    }

    // Local fallback
    const all = readLocalData("conversations.json", []);
    const userConvs = all.filter((c) => c.userId === userId);
    userConvs.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
    return NextResponse.json({ conversations: userConvs, isOffline: true });
  } catch (error) {
    console.warn("GET /api/conversations fallback:", error.message);
    const all = readLocalData("conversations.json", []);
    return NextResponse.json({ conversations: all, isOffline: true });
  }
}

// POST /api/conversations — Save or update conversation for user
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
    if (conn) {
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
    }

    // Local fallback
    const all = readLocalData("conversations.json", []);
    const index = all.findIndex((c) => c.id === id && c.userId === userId);
    const now = new Date().toISOString();
    const convObj = {
      id,
      userId,
      title: title || "New Conversation",
      messages: messages || [],
      updatedAt: now,
      createdAt: index !== -1 ? all[index].createdAt : now,
    };

    if (index !== -1) {
      all[index] = convObj;
    } else {
      all.unshift(convObj);
    }

    writeLocalData("conversations.json", all);
    return NextResponse.json({ success: true, conversation: convObj, isOffline: true });
  } catch (error) {
    console.warn("POST /api/conversations fallback:", error.message);
    return NextResponse.json({ success: true, isOffline: true });
  }
}

// DELETE /api/conversations — Delete all conversations for current user
export async function DELETE(request) {
  try {
    const authUser = await getAuthUser(request);
    const userId = authUser?.userId || "guest";

    const conn = await connectToDatabase();
    if (conn) {
      await Conversation.deleteMany({ userId });
    }

    // Local fallback
    const all = readLocalData("conversations.json", []);
    const filtered = all.filter((c) => c.userId !== userId);
    writeLocalData("conversations.json", filtered);

    return NextResponse.json({ success: true, message: "All conversations deleted." });
  } catch (error) {
    return NextResponse.json({ success: true });
  }
}
