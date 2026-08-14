import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { signToken, AUTH_COOKIE_OPTIONS } from "@/lib/auth";

// Decode Google JWT payload safely
function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = Buffer.from(base64, "base64").toString("utf-8");
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    let { name, email, googleId, avatar, credential } = body;

    // If Google GIS returns a JWT credential, parse real user details
    if (credential) {
      const decoded = parseJwt(credential);
      if (decoded && decoded.email) {
        email = decoded.email;
        name = decoded.name || decoded.given_name || name;
        googleId = decoded.sub || googleId;
        avatar = decoded.picture || avatar;
      }
    }

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: "Valid Google email is required." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const cleanName = (name || normalizedEmail.split("@")[0]).trim();
    const profileAvatar = avatar || cleanName.slice(0, 2).toUpperCase();

    const conn = await connectToDatabase();
    if (!conn) {
      return NextResponse.json(
        { error: "Could not connect to MongoDB Atlas database." },
        { status: 503 }
      );
    }

    // Find or create user in MongoDB Atlas
    let user = await User.findOne({
      $or: [{ googleId: googleId || "google_dummy" }, { email: normalizedEmail }],
    });

    if (!user) {
      user = await User.create({
        name: cleanName,
        email: normalizedEmail,
        googleId: googleId || `g_${Date.now()}`,
        avatar: profileAvatar,
        provider: "google",
        credits: 100,
      });
      console.log("✅ Saved new Google user to MongoDB Atlas:", user.email, "Avatar:", user.avatar);
    } else {
      if (googleId) user.googleId = googleId;
      user.name = cleanName;
      user.avatar = profileAvatar;
      user.provider = "google";
      await user.save();
      console.log("✅ Updated Google user profile in MongoDB Atlas:", user.email);
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
      avatar: user.avatar,
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
    console.error("Google MongoDB error:", error);
    return NextResponse.json(
      { error: error.message || "Google authentication failed in MongoDB." },
      { status: 500 }
    );
  }
}
