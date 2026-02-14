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
      <div className="animate-slide-in-up">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-400">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Sistem özeti ve hızlı erişim
        </p>
      </div>
      
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Users Card */}
        <Card variant="elevated" hoverable className="group animate-slide-in-up" style={{ animationDelay: "100ms" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg shadow-blue-500/40 group-hover:scale-110 transition-transform">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Kullanıcılar
                    </p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-400">
                      {userCount}
                    </p>
                  </div>
                </div>
                <Link
                  href="/admin/users"
                  className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <span>Kullanıcı listesi</span>
                  <svg className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Programs Card */}
        <Card variant="elevated" hoverable className="group animate-slide-in-up" style={{ animationDelay: "200ms" }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/40 group-hover:scale-110 transition-transform">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Programlar
                    </p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent dark:from-cyan-400 dark:to-blue-400">
                      {programCount}
                    </p>
                  </div>
                </div>
                <Link
                  href="/admin/programs"
                  className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <span>Program listesi</span>
                  <svg className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card variant="gradient" hoverable className="group animate-slide-in-up sm:col-span-2 lg:col-span-1" style={{ animationDelay: "300ms" }}>
          <CardContent className="p-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                Hızlı Erişim
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Sık kullanılan işlemler
              </p>
            </div>
            <div className="space-y-2">
              <Link
                href="/admin/programs"
                className="flex items-center gap-3 rounded-lg border border-slate-200/60 bg-white/80 backdrop-blur-sm px-3 py-2 text-sm font-medium text-slate-700 transition-all hover:border-blue-300 hover:shadow-md hover:scale-105 dark:border-slate-700/60 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:border-blue-600"
              >
                <svg className="h-5 w-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                <span>Yeni Program Oluştur</span>
              </Link>
              <Link
                href="/admin/requests"
                className="flex items-center gap-3 rounded-lg border border-slate-200/60 bg-white/80 backdrop-blur-sm px-3 py-2 text-sm font-medium text-slate-700 transition-all hover:border-blue-300 hover:shadow-md hover:scale-105 dark:border-slate-700/60 dark:bg-slate-800/80 dark:text-slate-300 dark:hover:border-blue-600"
              >
                <svg className="h-5 w-5 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <span>PT Talepleri</span>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
