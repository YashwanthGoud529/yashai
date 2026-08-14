import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import { getAuthUser } from "@/lib/auth";
import { readLocalData } from "@/lib/localStore";

export async function GET(request) {
  try {
    const authData = await getAuthUser(request);
    if (!authData || !authData.userId) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const conn = await connectToDatabase();

    if (conn) {
      const user = await User.findById(authData.userId).select("-password").lean();
      if (user) {
        return NextResponse.json({
          user: {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            avatar: user.avatar || user.name.slice(0, 2).toUpperCase(),
            credits: user.credits ?? 100,
          },
        });
      }
    }

    // Fallback to local store
    const users = readLocalData("users.json", []);
    const localUser = users.find((u) => u._id === authData.userId || u.email === authData.email);
    if (localUser) {
      return NextResponse.json({
        user: {
          id: localUser._id,
          name: localUser.name,
          email: localUser.email,
          avatar: localUser.avatar || localUser.name.slice(0, 2).toUpperCase(),
          credits: localUser.credits ?? 100,
        },
      });
    }

    return NextResponse.json({ user: null }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ user: null, error: error.message }, { status: 200 });
  }
}
