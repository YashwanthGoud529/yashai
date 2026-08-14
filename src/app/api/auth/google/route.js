import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { signToken, AUTH_COOKIE_OPTIONS } from "@/lib/auth";
import { readLocalData, writeLocalData } from "@/lib/localStore";

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
    const cleanName = (name || "Google Developer").trim();
    const initials = cleanName
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "GD";

    const conn = await connectToDatabase();
    let user = null;
    let userId = null;

    if (conn) {
      user = await User.findOne({
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
      } else {
        if (!user.googleId && googleId) user.googleId = googleId;
        user.avatar = initials;
        await user.save();
      }

      userId = user._id.toString();
    } else {
      const users = readLocalData("users.json", []);
      user = users.find((u) => u.email === normalizedEmail || u.googleId === googleId);

      if (!user) {
        userId = `usr_g_${Date.now()}`;
        user = {
          _id: userId,
          name: cleanName,
          email: normalizedEmail,
          googleId: googleId || `g_${Date.now()}`,
          avatar: initials,
          provider: "google",
          credits: 100,
          createdAt: new Date().toISOString(),
        };
        users.push(user);
        writeLocalData("users.json", users);
      } else {
        userId = user._id;
        user.avatar = initials;
        writeLocalData("users.json", users);
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
      avatar: initials,
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
