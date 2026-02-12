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

export async function PUT(request, { params }) {
  try {
    const auth = requireAdmin(request);
    if (auth.error) {
      return NextResponse.json(
        { message: auth.error.message },
        { status: auth.error.status }
      );
    }

    const { id } = await params;
    const body = await request.json();

    const update = {};
    if (typeof body.name === "string") {
      const name = body.name.trim();
      if (!name) {
        return NextResponse.json(
          { message: "Hareket adı boş olamaz." },
          { status: 400 }
        );
      }
      update.name = name;
    }
    if (typeof body.videoUrl === "string") {
      const url = body.videoUrl.trim();
      if (!url) {
        return NextResponse.json(
          { message: "Video URL boş olamaz." },
          { status: 400 }
        );
      }
      if (!/^https?:\/\/.+/i.test(url)) {
        return NextResponse.json(
          {
            message:
              "Geçerli bir video URL girin (http veya https ile başlamalı).",
          },
          { status: 400 }
        );
      }
      update.videoUrl = url;
    }

    await connectDB();
    const movement = await Movement.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).lean();

    if (!movement) {
      return NextResponse.json(
        { message: "Hareket bulunamadı." },
        { status: 404 }
      );
    }

    return NextResponse.json(movement);
  } catch (err) {
    console.error("Movement update error:", err);
    return NextResponse.json(
      { message: "Hareket güncellenirken hata oluştu." },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = requireAdmin(request);
    if (auth.error) {
      return NextResponse.json(
        { message: auth.error.message },
        { status: auth.error.status }
      );
    }

    const { id } = await params;

    await connectDB();
    const movement = await Movement.findByIdAndDelete(id).lean();

    if (!movement) {
      return NextResponse.json(
        { message: "Hareket bulunamadı." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Movement delete error:", err);
    return NextResponse.json(
      { message: "Hareket silinirken hata oluştu." },
      { status: 500 }
    );
  }
}
