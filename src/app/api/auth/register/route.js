import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { createToken, setAuthCookie } from "@/lib/auth";
import { validateRegisterBody } from "@/lib/validation";

export async function POST(request) {
  try {
    const body = await request.json();
    const validation = validateRegisterBody(body);
    if (!validation.ok) {
      return NextResponse.json(
        { message: validation.message },
        { status: 400 }
      );
    }

    const { email, password, name } = validation;
    await connectDB();

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { message: "Bu e-posta adresi zaten kayıtlı." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      email,
      password: hashedPassword,
      role: "USER",
      name: name || "",
    });

    const token = createToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name || "",
    });

    const response = NextResponse.json(
      {
        user: {
          id: user._id,
          email: user.email,
          role: user.role,
          name: user.name || "",
        },
      },
      { status: 201 }
    );
    setAuthCookie(response, token);
    return response;
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json(
      { message: "Kayıt sırasında bir hata oluştu." },
      { status: 500 }
    );
  }
}
