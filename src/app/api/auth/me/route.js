import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { getAuthUser, AUTH_COOKIE_OPTIONS } from "@/lib/auth";

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

    let user = null;
    try {
      user = await User.findById(authData.userId).select("-password").lean();
    } catch (err) {
      // Invalid ObjectId format from old mock data
      user = null;
    }

    // If user not in MongoDB Atlas or belongs to old mock data, clear session cookie immediately
    if (!user || user.email?.includes("yash.user_") || user.email === "demo@yashai.dev") {
      const response = NextResponse.json({ user: null }, { status: 200 });
      response.cookies.set({
        ...AUTH_COOKIE_OPTIONS,
        value: "",
        maxAge: 0,
      });
      return response;
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
    const response = NextResponse.json({ user: null }, { status: 200 });
    response.cookies.set({
      ...AUTH_COOKIE_OPTIONS,
      value: "",
      maxAge: 0,
    });
    return response;
  }
}
