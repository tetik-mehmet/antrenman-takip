import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import ProgramRequestModel from "@/models/ProgramRequest";
import { getAuthFromRequest } from "@/lib/auth";

export async function GET(request) {
  try {
    const { userId, role } = getAuthFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { message: "Giriş yapmalısınız." },
        { status: 401 }
      );
    }

    await connectDB();

    let query = {};
    if (role === "USER") {
      query.userId = userId;
    }
    // ADMIN: tüm talepler

    const requests = await ProgramRequestModel.find(query)
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(requests);
  } catch (err) {
    console.error("Program requests list error:", err);
    return NextResponse.json(
      { message: "Talepler listelenirken hata oluştu." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { userId, role } = getAuthFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { message: "Giriş yapmalısınız." },
        { status: 401 }
      );
    }

    if (role !== "USER") {
      return NextResponse.json(
        { message: "Sadece kullanıcılar program talep edebilir." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { notes } = body;

    if (!notes || typeof notes !== "string" || !notes.trim()) {
      return NextResponse.json(
        { message: "Not alanı zorunludur." },
        { status: 400 }
      );
    }

    await connectDB();
    const req = await ProgramRequestModel.create({
      userId,
      notes: notes.trim(),
      status: "PENDING",
    });

    const populated = await ProgramRequestModel.findById(req._id)
      .populate("userId", "name email")
      .lean();

    return NextResponse.json(populated, { status: 201 });
  } catch (err) {
    console.error("Program request create error:", err);
    return NextResponse.json(
      { message: "Talep oluşturulurken hata oluştu." },
      { status: 500 }
    );
  }
}
