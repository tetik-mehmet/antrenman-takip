import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Movement from "@/models/Movement";
import { getAuthFromRequest } from "@/lib/auth";

function requireAdmin(request) {
  const { userId, role } = getAuthFromRequest(request);
  if (!userId) {
    return { error: { message: "Giriş yapmalısınız.", status: 401 } };
  }
  if (role !== "ADMIN") {
    return {
      error: {
        message: "Bu işlem için yetkiniz yok.",
        status: 403,
      },
    };
  }
  return { userId, role };
}

export async function GET(request) {
  try {
    const { userId } = getAuthFromRequest(request);
    if (!userId) {
      return NextResponse.json(
        { message: "Giriş yapmalısınız." },
        { status: 401 }
      );
    }

    await connectDB();
    const movements = await Movement.find({}).sort({ createdAt: -1 }).lean();

    return NextResponse.json(movements);
  } catch (err) {
    console.error("Movements list error:", err);
    return NextResponse.json(
      { message: "Hareketler listelenirken hata oluştu." },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const auth = requireAdmin(request);
    if (auth.error) {
      return NextResponse.json(
        { message: auth.error.message },
        { status: auth.error.status }
      );
    }

    const body = await request.json();
    const rawName = typeof body.name === "string" ? body.name.trim() : "";
    const rawUrl =
      typeof body.videoUrl === "string" ? body.videoUrl.trim() : "";

    if (!rawName || !rawUrl) {
      return NextResponse.json(
        { message: "Hareket adı ve video URL zorunludur." },
        { status: 400 }
      );
    }

    // Basit URL kontrolü (tam regex yerine minimum doğrulama)
    if (!/^https?:\/\/.+/i.test(rawUrl)) {
      return NextResponse.json(
        {
          message:
            "Geçerli bir video URL girin (http veya https ile başlamalı).",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const existing = await Movement.findOne({ name: rawName }).lean();
    if (existing) {
      return NextResponse.json(
        { message: "Bu isimde bir hareket zaten mevcut." },
        { status: 409 }
      );
    }

    const movement = await Movement.create({
      name: rawName,
      videoUrl: rawUrl,
      createdBy: auth.userId,
    });

    const plain = movement.toObject();

    return NextResponse.json(plain, { status: 201 });
  } catch (err) {
    console.error("Movement create error:", err);
    return NextResponse.json(
      { message: "Hareket oluşturulurken hata oluştu." },
      { status: 500 }
    );
  }
}
