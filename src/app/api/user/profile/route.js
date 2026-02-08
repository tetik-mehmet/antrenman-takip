import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getAuthFromCookies, createToken, setAuthCookie } from "@/lib/auth";

export async function PATCH(request) {
  try {
    const cookieStore = await cookies();
    const { userId, email, role } = getAuthFromCookies(cookieStore);
    if (!userId) {
      return NextResponse.json(
        { message: "Oturum açmanız gerekiyor." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";

    await connectDB();
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { name } },
      { new: true, runValidators: true }
    )
      .select("name email role")
      .lean();

    if (!user) {
      return NextResponse.json(
        { message: "Kullanıcı bulunamadı." },
        { status: 404 }
      );
    }

    const token = createToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      name: user.name || "",
    });

    const response = NextResponse.json({
      user: { name: user.name || "", email: user.email, role: user.role },
    });
    setAuthCookie(response, token);
    return response;
  } catch (err) {
    console.error("Profile update error:", err);
    return NextResponse.json(
      { message: "İsim güncellenirken bir hata oluştu." },
      { status: 500 }
    );
  }
}
