import connectDB from "@/lib/db";
import User from "@/models/User";
import TrainingProgram from "@/models/TrainingProgram";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Link from "next/link";

export default async function AdminDashboardPage() {
  await connectDB();
  const [userCount, programCount] = await Promise.all([
    User.countDocuments(),
    TrainingProgram.countDocuments(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
        Admin Dashboard
      </h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              Kullanıcılar
            </h2>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-700 dark:text-slate-300">
              {userCount}
            </p>
            <Link
              href="/admin/users"
              className="mt-2 inline-block text-sm font-medium text-slate-600 underline dark:text-slate-400"
            >
              Kullanıcı listesi →
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              Toplam program
            </h2>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-slate-700 dark:text-slate-300">
              {programCount}
            </p>
            <Link
              href="/admin/programs"
              className="mt-2 inline-block text-sm font-medium text-slate-600 underline dark:text-slate-400"
            >
              Program listesi →
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
