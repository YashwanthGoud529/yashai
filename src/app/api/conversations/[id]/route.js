import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Conversation from "@/models/Conversation";
import { getAuthUser } from "@/lib/auth";

// GET /api/conversations/[id] from MongoDB Atlas
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const authUser = await getAuthUser(request);
    const userId = authUser?.userId || "guest";

    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ error: "Database offline" }, { status: 503 });
    }

    const conversation = await Conversation.findOne({ id, userId }).lean();
    if (!conversation) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }
    return NextResponse.json({ conversation });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/conversations/[id] from MongoDB Atlas
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const authUser = await getAuthUser(request);
    const userId = authUser?.userId || "guest";

    const conn = await connectToDatabase();
    if (conn) {
      await Conversation.findOneAndDelete({ id, userId });
    }
    return NextResponse.json({ success: true, message: `Conversation ${id} deleted from MongoDB Atlas.` });
  } catch (error) {
    return NextResponse.json({ success: true });
  }
}

// PATCH /api/conversations/[id] in MongoDB Atlas
export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const authUser = await getAuthUser(request);
    const userId = authUser?.userId || "guest";

    const body = await request.json();
    const conn = await connectToDatabase();

    if (conn) {
      const updated = await Conversation.findOneAndUpdate(
        { id, userId },
        { $set: { ...body, updatedAt: new Date() } },
        { returnDocument: 'after' }
      );
      return NextResponse.json({ success: true, conversation: updated });
    }

    return NextResponse.json({ success: false, error: "Database offline" }, { status: 503 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
