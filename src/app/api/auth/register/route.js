import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { signToken, AUTH_COOKIE_OPTIONS } from "@/lib/auth";
import { readLocalData, writeLocalData } from "@/lib/localStore";

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

    // Hash password with salt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const initials = name.trim().slice(0, 2).toUpperCase();

    let userResponse = null;
    let userId = null;

    if (conn) {
      const existingUser = await User.findOne({ email: normalizedEmail });
      if (existingUser) {
        return NextResponse.json(
          { error: "An account with this email already exists. Please log in." },
          { status: 409 }
        );
      }

      const newUser = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        avatar: initials,
        credits: 100,
      });

      userId = newUser._id.toString();
      userResponse = {
        id: userId,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        credits: newUser.credits,
      };
    } else {
      // Local persistent store fallback
      const users = readLocalData("users.json", []);
      const exists = users.find((u) => u.email === normalizedEmail);
      if (exists) {
        return NextResponse.json(
          { error: "An account with this email already exists. Please log in." },
          { status: 409 }
        );
      }

      userId = `usr_${Date.now()}`;
      const newUser = {
        _id: userId,
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        avatar: initials,
        credits: 100,
        createdAt: new Date().toISOString(),
      };

      users.push(newUser);
      writeLocalData("users.json", users);

      userResponse = {
        id: userId,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        credits: newUser.credits,
      };
    }

    const userPayload = {
      userId,
      email: normalizedEmail,
      name: name.trim(),
    };

    const token = signToken(userPayload);

    const response = NextResponse.json({
      success: true,
      user: userResponse,
      token,
      message: "Account created successfully.",
    });

    response.cookies.set({
      ...AUTH_COOKIE_OPTIONS,
      value: token,
    });

    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create account." },
      { status: 500 }
    );
  }
}
