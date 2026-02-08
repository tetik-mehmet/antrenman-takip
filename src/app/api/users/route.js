import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getAuthFromRequest } from "@/lib/auth";

export async function GET(request) {
  try {
    const { role } = getAuthFromRequest(request);
    if (role !== "ADMIN") {
      return NextResponse.json(
        { message: "Yetkisiz erişim." },
        { status: 403 }
      );
    }

    await connectDB();
    const users = await User.find({}).select("-password").lean();
    return NextResponse.json(users);
  } catch (err) {
    console.error("Users list error:", err);
    return NextResponse.json(
      { message: "Kullanıcılar listelenirken hata oluştu." },
      { status: 500 }
    );
  }
}
