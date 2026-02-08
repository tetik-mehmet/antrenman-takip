import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { createToken, setAuthCookie } from "@/lib/auth";
import { validateLoginBody } from "@/lib/validation";

export async function POST(request) {
  try {
    const body = await request.json();
    const validation = validateLoginBody(body);
    if (!validation.ok) {
      return NextResponse.json(
        { message: validation.message },
        { status: 400 }
      );
    }

    const { email, password } = validation;
    await connectDB();

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return NextResponse.json(
        { message: "E-posta veya şifre hatalı." },
        { status: 401 }
      );
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return NextResponse.json(
        { message: "E-posta veya şifre hatalı." },
        { status: 401 }
      );
    }

    const token = createToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name || "",
    });

    const response = NextResponse.json({
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name || "",
      },
    });
    setAuthCookie(response, token);
    return response;
  } catch (err) {
    console.error("Login error:", err);
    const message =
      process.env.NODE_ENV === "development"
        ? err.message || "Giriş sırasında bir hata oluştu."
        : "Giriş sırasında bir hata oluştu.";
    return NextResponse.json({ message }, { status: 500 });
  }
}
