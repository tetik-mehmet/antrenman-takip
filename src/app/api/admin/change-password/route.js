import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getAuthFromRequest } from "@/lib/auth";
import { validatePassword } from "@/lib/validation";

export async function PATCH(request) {
  try {
    const { userId, role } = getAuthFromRequest(request);
    if (!userId || role !== "ADMIN") {
      return NextResponse.json(
        { message: "Yetkisiz erişim." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || typeof currentPassword !== "string") {
      return NextResponse.json(
        { message: "Mevcut şifre gerekli." },
        { status: 400 }
      );
    }

    if (!validatePassword(newPassword)) {
      return NextResponse.json(
        { message: "Yeni şifre en az 6 karakter olmalıdır." },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findById(userId).select("+password").lean();
    if (!user) {
      return NextResponse.json(
        { message: "Kullanıcı bulunamadı." },
        { status: 404 }
      );
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Mevcut şifre hatalı." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    return NextResponse.json({ message: "Şifre başarıyla güncellendi." });
  } catch (err) {
    console.error("Change password error:", err);
    return NextResponse.json(
      { message: "Şifre güncellenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
