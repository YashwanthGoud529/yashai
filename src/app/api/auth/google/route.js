import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { signToken, AUTH_COOKIE_OPTIONS } from "@/lib/auth";
import { readLocalData, writeLocalData } from "@/lib/localStore";

export async function POST(request) {
  try {
    const { name, email, googleId, avatar } = await request.json();

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: "Valid Google email is required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const conn = await connectToDatabase();
    let user = null;
    let userId = null;

    if (conn) {
      // Find existing user by googleId or email
      user = await User.findOne({
        $or: [{ googleId: googleId || "google_dummy" }, { email: normalizedEmail }],
      });

      if (!user) {
        // Create new user with Google profile
        user = await User.create({
          name: name || "Google User",
          email: normalizedEmail,
          googleId: googleId || `g_${Date.now()}`,
          avatar: avatar || (name || "G").slice(0, 2).toUpperCase(),
          provider: "google",
          credits: 100,
        });
      } else {
        // Update avatar / name if empty
        if (!user.googleId && googleId) user.googleId = googleId;
        if (avatar && (!user.avatar || user.avatar.length <= 2)) user.avatar = avatar;
        await user.save();
      }

      userId = user._id.toString();
    } else {
      // Local fallback
      const users = readLocalData("users.json", []);
      user = users.find((u) => u.email === normalizedEmail || u.googleId === googleId);

      if (!user) {
        userId = `usr_g_${Date.now()}`;
        user = {
          _id: userId,
          name: name || "Google User",
          email: normalizedEmail,
          googleId: googleId || `g_${Date.now()}`,
          avatar: avatar || (name || "G").slice(0, 2).toUpperCase(),
          provider: "google",
          credits: 100,
          createdAt: new Date().toISOString(),
        };
        users.push(user);
        writeLocalData("users.json", users);
      } else {
        userId = user._id;
      }
    }

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
      avatar: user.avatar || (user.name || "G").slice(0, 2).toUpperCase(),
      credits: user.credits ?? 100,
      provider: "google",
    };

    const response = NextResponse.json({
      success: true,
      user: userResponse,
      token,
      message: "Successfully signed in with Google!",
    });

    response.cookies.set({
      ...AUTH_COOKIE_OPTIONS,
      value: token,
    });

    return response;
  } catch (error) {
    console.error("Google Auth error:", error);
    return NextResponse.json(
      { error: error.message || "Google authentication failed." },
      { status: 500 }
    );
  }
}
