import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { signToken, AUTH_COOKIE_OPTIONS } from "@/lib/auth";
import { readLocalData } from "@/lib/localStore";

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

    let user = null;
    let userId = null;

    if (conn) {
      user = await User.findOne({ email: normalizedEmail });
      if (user) {
        userId = user._id.toString();
      }
    } else {
      const users = readLocalData("users.json", []);
      user = users.find((u) => u.email === normalizedEmail);
      if (user) {
        userId = user._id;
      }
    }

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password. Please try again." },
        { status: 401 }
      );
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { error: "Invalid email or password. Please try again." },
        { status: 401 }
      );
    }

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
    };

    const response = NextResponse.json({
      success: true,
      user: userResponse,
      token,
      message: "Logged in successfully.",
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
