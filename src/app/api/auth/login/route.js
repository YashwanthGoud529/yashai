import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { signToken, AUTH_COOKIE_OPTIONS } from "@/lib/auth";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !email.trim() || !password) {
      return NextResponse.json(
        { error: "Please provide both email and password." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const conn = await connectToDatabase();

    if (!conn) {
      return NextResponse.json(
        { error: "Could not connect to MongoDB Atlas database." },
        { status: 503 }
      );
    }

    // Find user in MongoDB Atlas
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email in MongoDB Atlas. Please register first." },
        { status: 401 }
      );
    }

    // Verify password
    if (user.password) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return NextResponse.json(
          { error: "Invalid password. Please try again." },
          { status: 401 }
        );
      }
    }

    const userId = user._id.toString();

    const userPayload = {
      userId,
      email: user.email,
      name: user.name,
    };

    const token = signToken(userPayload);

    const userResponse = {
      id: userId,
      name: user.name,
      email: user.email,
      avatar: user.avatar || user.name.slice(0, 2).toUpperCase(),
      credits: user.credits ?? 100,
      provider: user.provider || "local",
    };

    const response = NextResponse.json({
      success: true,
      user: userResponse,
      token,
      message: "Logged in successfully from MongoDB Atlas.",
    });

    response.cookies.set({
      ...AUTH_COOKIE_OPTIONS,
      value: token,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to log in." },
      { status: 500 }
    );
  }
}
