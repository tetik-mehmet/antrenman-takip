import { notFound } from "next/navigation";
import connectDB from "@/lib/db";
import TrainingProgram from "@/models/TrainingProgram";
import { cookies } from "next/headers";
import { getAuthFromCookies } from "@/lib/auth";
import ProgramDetail from "@/components/ProgramDetail";

export default async function UserProgramDetailPage({ params }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const { userId } = getAuthFromCookies(cookieStore);
  if (!userId) notFound();

  await connectDB();
  const program = await TrainingProgram.findOne({
    _id: id,
    userId,
  })
    .populate("userId", "email")
    .lean();
  if (!program) notFound();

  // Sunucu → istemci geçişi için düz nesneye dönüştür (Mongoose ObjectId/Date serileştirme hatasını önler)
  const programPlain = JSON.parse(JSON.stringify(program));

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
        {program.title}
      </h1>
      <ProgramDetail
        program={programPlain}
        canEdit={program.createdBy === "USER"}
        backHref="/user/my-programs"
      />
    </div>
  );
}
