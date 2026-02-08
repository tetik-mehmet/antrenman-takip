import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getAuthFromRequest } from "@/lib/auth";
import { validateEmail, validatePassword } from "@/lib/validation";

export async function POST(request) {
  try {
    const { userId, role } = getAuthFromRequest(request);
    if (!userId || role !== "ADMIN") {
      return NextResponse.json(
        { message: "Yetkisiz erişim." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { email, password, name } = body;

    if (!validateEmail(email)) {
      return NextResponse.json(
        { message: "Geçerli bir e-posta adresi girin." },
        { status: 400 }
      );
    }

    if (!validatePassword(password)) {
      return NextResponse.json(
        { message: "Şifre en az 6 karakter olmalıdır." },
        { status: 400 }
      );
    }

    await connectDB();

    const existing = await User.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { message: "Bu e-posta adresi zaten kayıtlı." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: "ADMIN",
      name: name && typeof name === "string" ? name.trim() : "",
    });

    return NextResponse.json(
      { message: "Hoca başarıyla eklendi." },
      { status: 201 }
    );
  } catch (err) {
    console.error("Add admin error:", err);
    return NextResponse.json(
      { message: "Hoca eklenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
