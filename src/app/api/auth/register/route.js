import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { signToken, AUTH_COOKIE_OPTIONS } from "@/lib/auth";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: "Please enter your full name." },
        { status: 400 }
      );
    }

    if (!email || !email.trim()) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const conn = await connectToDatabase();

    if (!conn) {
      return NextResponse.json(
        { error: "Could not connect to MongoDB Atlas database. Please check connection string." },
        { status: 503 }
      );
    }

    // Check if user exists in MongoDB
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists in MongoDB. Please log in." },
        { status: 409 }
      );
    }

    // Hash password with salt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const cleanName = name.trim();
    const initials = cleanName
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "YG";

    // Save directly to MongoDB Atlas
    const newUser = await User.create({
      name: cleanName,
      email: normalizedEmail,
      password: hashedPassword,
      avatar: initials,
      provider: "local",
      credits: 100,
    });

    const userId = newUser._id.toString();

    const userPayload = {
      userId,
      email: normalizedEmail,
      name: newUser.name,
    };

    const token = signToken(userPayload);

    const userResponse = {
      id: userId,
      name: newUser.name,
      email: newUser.email,
      avatar: newUser.avatar,
      credits: newUser.credits,
      provider: "local",
    };

    const response = NextResponse.json({
      success: true,
      user: userResponse,
      token,
      message: "Account created and saved directly to MongoDB Atlas.",
    });

    response.cookies.set({
      ...AUTH_COOKIE_OPTIONS,
      value: token,
    });

    return response;
  } catch (error) {
    console.error("MongoDB Atlas registration error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create account in MongoDB." },
      { status: 500 }
    );
  }
}
