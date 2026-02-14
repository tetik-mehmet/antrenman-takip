import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import TrainingProgram from "@/models/TrainingProgram";
import User from "@/models/User";
import { getAuthFromRequest } from "@/lib/auth";
import mongoose from "mongoose";

export async function POST(request, { params }) {
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
        { message: "Bu işlem için yetkiniz yok." },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const { targetUserIds } = body;

    if (!Array.isArray(targetUserIds) || targetUserIds.length === 0) {
      return NextResponse.json(
        { message: "En az bir kullanıcı seçin." },
        { status: 400 }
      );
    }

    const validIds = targetUserIds.filter(
      (id) => id && mongoose.Types.ObjectId.isValid(id)
    );
    if (validIds.length === 0) {
      return NextResponse.json(
        { message: "Geçerli kullanıcı seçin." },
        { status: 400 }
      );
    }

    await connectDB();

    const program = await TrainingProgram.findById(id).lean();
    if (!program) {
      return NextResponse.json(
        { message: "Program bulunamadı." },
        { status: 404 }
      );
    }

    const existingUsers = await User.find({
      _id: { $in: validIds },
    }).select("_id");
    const existingIds = new Set(existingUsers.map((u) => u._id.toString()));
    const ownerIdStr = program.userId ? String(program.userId) : null;

    function normalizeReps(v) {
      if (v == null) return "1";
      const s = String(v).trim();
      return s || "1";
    }

    const toCreate = validIds.filter(
      (tid) => existingIds.has(tid) && tid !== ownerIdStr
    );
    if (toCreate.length === 0) {
      return NextResponse.json(
        {
          message:
            ownerIdStr && validIds.includes(ownerIdStr)
              ? "Programın sahibine tekrar atama yapılamaz. Başka kullanıcı seçin."
              : "Seçilen kullanıcılardan hiçbiri bulunamadı.",
        },
        { status: 400 }
      );
    }

    const created = await TrainingProgram.insertMany(
      toCreate.map((uid) => ({
        title: program.title,
        userId: uid,
        createdBy: "ADMIN",
        days: (program.days || []).map((d) => ({
          dayName: d.dayName || "",
          exercises: (d.exercises || []).map((e) => ({
            name: e.name || "",
            sets: Number(e.sets) || 1,
            reps: normalizeReps(e.reps),
          })),
        })),
      }))
    );

    return NextResponse.json(
      {
        count: created.length,
        message: `Program ${created.length} kullanıcıya atandı.`,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Training program assign error:", err);
    return NextResponse.json(
      { message: "Program atanırken hata oluştu." },
      { status: 500 }
    );
  }
}
