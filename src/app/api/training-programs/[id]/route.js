import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import TrainingProgram from "@/models/TrainingProgram";
import { getAuthFromRequest } from "@/lib/auth";

async function getProgramAndCheckAccess(request, id) {
  const { userId, role } = getAuthFromRequest(request);
  if (!userId) return { status: 401, message: "Giriş yapmalısınız." };

  await connectDB();
  const program = await TrainingProgram.findById(id).populate(
    "userId",
    "name email"
  );
  if (!program) return { status: 404, message: "Program bulunamadı." };

  const isOwner = program.userId._id.toString() === userId;
  const canAccess = role === "ADMIN" || isOwner;
  if (!canAccess)
    return { status: 403, message: "Bu programa erişim yetkiniz yok." };

  return { program, role };
}

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const result = await getProgramAndCheckAccess(request, id);
    if (result.status) {
      return NextResponse.json(
        { message: result.message },
        { status: result.status }
      );
    }
    return NextResponse.json(result.program);
  } catch (err) {
    console.error("Training program get error:", err);
    return NextResponse.json(
      { message: "Program alınırken hata oluştu." },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const result = await getProgramAndCheckAccess(request, id);
    if (result.status) {
      return NextResponse.json(
        { message: result.message },
        { status: result.status }
      );
    }
    if (result.role === "USER" && result.program.createdBy === "ADMIN") {
      return NextResponse.json(
        { message: "Admin tarafından atanan programlar düzenlenemez." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, days } = body;

    const update = {};
    if (title !== undefined) update.title = title;
    if (Array.isArray(days)) {
      update.days = days.map((d) => ({
        dayName: d.dayName || "",
        exercises: (d.exercises || []).map((e) => ({
          name: e.name || "",
          sets: Number(e.sets) || 1,
          reps: Number(e.reps) || 1,
        })),
      }));
    }

    const program = await TrainingProgram.findByIdAndUpdate(id, update, {
      new: true,
    })
      .populate("userId", "name email")
      .lean();

    return NextResponse.json(program);
  } catch (err) {
    console.error("Training program update error:", err);
    return NextResponse.json(
      { message: "Program güncellenirken hata oluştu." },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const result = await getProgramAndCheckAccess(request, id);
    if (result.status) {
      return NextResponse.json(
        { message: result.message },
        { status: result.status }
      );
    }
    if (result.role === "USER" && result.program.createdBy === "ADMIN") {
      return NextResponse.json(
        { message: "Admin tarafından atanan programlar silinemez." },
        { status: 403 }
      );
    }

    await TrainingProgram.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Training program delete error:", err);
    return NextResponse.json(
      { message: "Program silinirken hata oluştu." },
      { status: 500 }
    );
  }
}
