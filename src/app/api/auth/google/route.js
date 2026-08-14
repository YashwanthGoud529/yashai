import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { signToken, AUTH_COOKIE_OPTIONS } from "@/lib/auth";

export async function POST(request) {
  try {
    const { name, email, googleId } = await request.json();

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: "Valid Google email is required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const cleanName = (name || "Google User").trim();
    const initials = cleanName
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "GU";

    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json(
        { error: "Could not connect to MongoDB Atlas database." },
        { status: 503 }
      );
    }

    // Find or create in MongoDB Atlas
    let user = await User.findOne({
      $or: [{ googleId: googleId || "google_dummy" }, { email: normalizedEmail }],
    });

    if (!user) {
      user = await User.create({
        name: cleanName,
        email: normalizedEmail,
        googleId: googleId || `g_${Date.now()}`,
        avatar: initials,
        provider: "google",
        credits: 100,
      });
      console.log("✅ Created new Google user in MongoDB Atlas:", user.email);
    } else {
      if (!user.googleId && googleId) user.googleId = googleId;
      user.avatar = initials;
      user.provider = "google";
      await user.save();
      console.log("✅ Found existing Google user in MongoDB Atlas:", user.email);
    }

    const userId = user._id.toString();

    const userPayload = {
      userId,
      email: normalizedEmail,
      name: user.name,
    };

    const token = signToken(userPayload);

    const userResponse = {
      id: userId,
      name: user.name,
      email: user.email,
      avatar: initials,
      credits: user.credits ?? 100,
      provider: "google",
    };

    const response = NextResponse.json({
      success: true,
      user: userResponse,
      token,
      message: "Successfully authenticated with Google in MongoDB Atlas!",
    });

    response.cookies.set({
      ...AUTH_COOKIE_OPTIONS,
      value: token,
    });

    return response;
  } catch (error) {
    console.error("Google MongoDB error:", error);
    return NextResponse.json(
      { error: error.message || "Google authentication failed in MongoDB." },
      { status: 500 }
    );
  }
}
