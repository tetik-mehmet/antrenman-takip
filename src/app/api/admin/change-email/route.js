import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getAuthFromRequest, createToken, setAuthCookie } from "@/lib/auth";
import { validateEmail } from "@/lib/validation";

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
    const { newEmail, currentPassword } = body;

    if (!validateEmail(newEmail)) {
      return NextResponse.json(
        { message: "Geçerli bir e-posta adresi girin." },
        { status: 400 }
      );
    }

    if (!currentPassword || typeof currentPassword !== "string") {
      return NextResponse.json(
        { message: "Güvenlik için mevcut şifrenizi girin." },
        { status: 400 }
      );
    }

    const normalizedEmail = newEmail.trim().toLowerCase();

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

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing && existing._id.toString() !== userId) {
      return NextResponse.json(
        { message: "Bu e-posta adresi zaten kullanılıyor." },
        { status: 400 }
      );
    }

    const updated = await User.findByIdAndUpdate(
      userId,
      { $set: { email: normalizedEmail } },
      { new: true, runValidators: true }
    )
      .select("name email role")
      .lean();

    const token = createToken({
      userId: updated._id.toString(),
      email: updated.email,
      role: updated.role,
      name: updated.name || "",
    });

    const response = NextResponse.json({
      message: "E-posta adresiniz güncellendi.",
      user: {
        name: updated.name || "",
        email: updated.email,
        role: updated.role,
      },
    });
    setAuthCookie(response, token);
    return response;
  } catch (err) {
    console.error("Change email error:", err);
    return NextResponse.json(
      { message: "E-posta güncellenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
