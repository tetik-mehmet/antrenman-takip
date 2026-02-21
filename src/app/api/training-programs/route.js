import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import TrainingProgram from "@/models/TrainingProgram";
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
    const { searchParams } = new URL(request.url);
    const filterUserId = searchParams.get("userId");

    let query = {};
    if (role === "USER") {
      query.userId = userId;
    } else if (role === "ADMIN" && filterUserId) {
      query.userId = filterUserId;
    }
    // ADMIN without userId = all programs

    const programs = await TrainingProgram.find(query)
      .populate("userId", "name email role")
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json(programs);
  } catch (err) {
    console.error("Training programs list error:", err);
    return NextResponse.json(
      { message: "Programlar listelenirken hata oluştu." },
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

    const body = await request.json();
    const { title, targetUserId, days } = body;

    if (!title || !Array.isArray(days)) {
      return NextResponse.json(
        { message: "Başlık ve günler gerekli." },
        { status: 400 }
      );
    }

    const programUserId =
      role === "ADMIN" && targetUserId ? targetUserId : userId;

    function normalizeReps(v) {
      if (v == null) return "1";
      const s = String(v).trim();
      return s || "1";
    }

    await connectDB();
    const program = await TrainingProgram.create({
      title,
      userId: programUserId,
      createdBy: role,
      days: days.map((d) => ({
        dayName: d.dayName || "",
        exercises: (d.exercises || []).map((e) => ({
          name: e.name || "",
          sets: Number(e.sets) || 1,
          reps: normalizeReps(e.reps),
          movementId: e.movementId || undefined,
          videoUrl: e.videoUrl || undefined,
        })),
      })),
    });

    const populated = await TrainingProgram.findById(program._id)
      .populate("userId", "name email role")
      .lean();

    return NextResponse.json(populated, { status: 201 });
  } catch (err) {
    console.error("Training program create error:", err);
    return NextResponse.json(
      { message: "Program oluşturulurken hata oluştu." },
      { status: 500 }
    );
  }
}
