import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import ProgramRequestModel from "@/models/ProgramRequest";
import { getAuthFromRequest } from "@/lib/auth";

const VALID_STATUSES = ["PENDING", "IN_PROGRESS", "DONE"];

export async function PATCH(request, { params }) {
  try {
    const { userId, role } = getAuthFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { message: "Giriş yapmalısınız." },
        { status: 401 }
      );
    }

    if (role !== "ADMIN") {
      return NextResponse.json(
        { message: "Sadece admin durumu güncelleyebilir." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { message: "Geçerli bir durum gerekli (PENDING, IN_PROGRESS, DONE)." },
        { status: 400 }
      );
    }

    await connectDB();
    const updated = await ProgramRequestModel.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )
      .populate("userId", "name email")
      .lean();

    if (!updated) {
      return NextResponse.json(
        { message: "Talep bulunamadı." },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error("Program request update error:", err);
    return NextResponse.json(
      { message: "Talep durumu güncellenirken hata oluştu." },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { role } = getAuthFromRequest(request);
    if (role !== "ADMIN") {
      return NextResponse.json(
        { message: "Sadece admin talep silebilir." },
        { status: 403 }
      );
    }

    const { id } = await params;
    await connectDB();
    const deleted = await ProgramRequestModel.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { message: "Talep bulunamadı." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Program request delete error:", err);
    return NextResponse.json(
      { message: "Talep silinirken hata oluştu." },
      { status: 500 }
    );
  }
}
