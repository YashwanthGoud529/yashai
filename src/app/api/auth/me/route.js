import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { getAuthUser } from "@/lib/auth";

export async function GET(request) {
  try {
    const authData = await getAuthUser(request);
    if (!authData || !authData.userId) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const user = await User.findById(authData.userId).select("-password").lean();
    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar || user.name.slice(0, 2).toUpperCase(),
        credits: user.credits ?? 100,
        provider: user.provider || "local",
      },
    });
  } catch (error) {
    return NextResponse.json({ user: null, error: error.message }, { status: 200 });
  }
}
