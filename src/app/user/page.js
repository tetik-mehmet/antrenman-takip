import connectDB from "@/lib/db";
import TrainingProgram from "@/models/TrainingProgram";
import { cookies } from "next/headers";
import { getAuthFromCookies } from "@/lib/auth";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Link from "next/link";
import ProfileNameForm from "@/components/user/ProfileNameForm";
import ProgramRequestForm from "@/components/user/ProgramRequestForm";

export default async function UserDashboardPage() {
  const cookieStore = await cookies();
  const { userId, name } = getAuthFromCookies(cookieStore);
  if (!userId) return null;

  await connectDB();
  const programs = await TrainingProgram.find({ userId })
    .sort({ updatedAt: -1 })
    .limit(6)
    .lean();

  const greeting = name?.trim() ? `Merhaba, ${name}` : "Merhaba";
  const initial = name?.trim()?.charAt(0)?.toUpperCase() || "?";

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100 sm:text-2xl lg:text-3xl">
          Anasayfa
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Antrenmanlarınızı buradan yönetin.
        </p>
      </div>

      <ProgramRequestForm />

      {/* Üyelik Paketleri */}
      <section className="animate-slide-in-up" style={{ animationDelay: "100ms" }}>
        <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
          Üyelik Paketleri
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="group relative overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-blue-400 to-blue-600 p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/30 hover:scale-105 animate-slide-in-up" style={{ animationDelay: "150ms" }}>
            <div className="absolute right-0 top-0 h-24 w-24 translate-x-4 -translate-y-4 rounded-full bg-white/10 animate-float" />
            <div className="relative">
              <span className="text-sm font-medium uppercase tracking-wider text-blue-100">
                1 Aylık
              </span>
              <p className="mt-2 text-3xl font-bold text-white">₺2.500</p>
              <p className="mt-1 text-sm text-blue-100/90">
                Kısa süreli deneme
              </p>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-cyan-400 to-blue-600 p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/30 hover:scale-105 animate-slide-in-up" style={{ animationDelay: "200ms" }}>
            <div className="absolute right-0 top-0 h-24 w-24 translate-x-4 -translate-y-4 rounded-full bg-white/10 animate-float" style={{ animationDelay: "0.5s" }} />
            <div className="relative">
              <span className="text-sm font-medium uppercase tracking-wider text-cyan-100">
                3 Aylık
              </span>
              <p className="mt-2 text-3xl font-bold text-white">₺6.000</p>
              <p className="mt-1 text-sm text-cyan-100/90">Aylık ₺2.000</p>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-2xl border-2 border-white/50 bg-gradient-to-br from-blue-500 to-indigo-600 p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-105 animate-slide-in-up" style={{ animationDelay: "250ms" }}>
            <div className="absolute -top-3 -right-3">
              <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-bold text-blue-600 shadow-lg animate-bounce">
                Popüler
              </span>
            </div>
            <div className="absolute right-0 top-0 h-24 w-24 translate-x-4 -translate-y-4 rounded-full bg-white/10 animate-float" style={{ animationDelay: "1s" }} />
            <div className="relative">
              <span className="text-sm font-medium uppercase tracking-wider text-blue-100">
                6 Aylık
              </span>
              <p className="mt-2 text-3xl font-bold text-white">₺10.000</p>
              <p className="mt-1 text-sm text-blue-100/90">
                Aylık ₺1.667
              </p>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-sky-500 to-blue-700 p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:shadow-sky-500/30 hover:scale-105 animate-slide-in-up" style={{ animationDelay: "300ms" }}>
            <div className="absolute right-0 top-0 h-24 w-24 translate-x-4 -translate-y-4 rounded-full bg-white/10 animate-float" style={{ animationDelay: "1.5s" }} />
            <div className="relative">
              <span className="text-sm font-medium uppercase tracking-wider text-sky-100">
                12 Aylık
              </span>
              <p className="mt-2 text-3xl font-bold text-white">₺18.000</p>
              <p className="mt-1 text-sm text-sky-100/90">
                Aylık ₺1.500 · En avantajlı
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Profil kartı */}
      <section className="overflow-hidden rounded-2xl border border-white/20 bg-white/80 backdrop-blur-sm shadow-lg dark:border-slate-700/50 dark:bg-slate-800/80 animate-slide-in-up" style={{ animationDelay: "200ms" }}>
        <div className="relative bg-gradient-to-br from-blue-50 via-white to-cyan-50/30 px-6 py-6 dark:from-slate-800/80 dark:via-slate-800 dark:to-blue-950/20 sm:px-8 sm:py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 text-2xl font-bold text-white shadow-lg shadow-blue-500/40 ring-2 ring-white animate-pulse-glow dark:ring-slate-700"
              aria-hidden
            >
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Profil
              </p>
              <p className="mt-1 text-xl font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-400 sm:text-2xl">
                {greeting}
              </p>
              <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                Görünen adınızı aşağıdan güncelleyebilirsiniz.
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-200/60 px-6 py-5 dark:border-slate-700/60 sm:px-8 sm:py-6">
          <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
            Görünen ad
          </p>
          <ProfileNameForm initialName={name || ""} hideLabel />
        </div>
      </section>

      {programs.some((p) => p.createdBy === "ADMIN") && (
        <div
          className="flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 dark:border-amber-600 dark:bg-amber-950/40"
          role="alert"
        >
          <span className="text-amber-600 dark:text-amber-400" aria-hidden>
            !
          </span>
          <p className="text-sm font-medium text-amber-800 dark:text-amber-200 animate-blink">
            PT tarafından atanan programlarda düzenleme yapılamaz!
          </p>
        </div>
      )}
      <Card variant="elevated" className="overflow-hidden animate-slide-in-up" style={{ animationDelay: "300ms" }}>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-400">
              Son programlar
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              En son güncellenen programlarınız.
            </p>
          </div>
          <Link
            href="/user/my-programs"
            className="inline-flex shrink-0 items-center text-sm font-medium text-blue-600 underline-offset-4 hover:text-blue-700 hover:underline transition-colors dark:text-blue-400 dark:hover:text-blue-300"
          >
            Tümünü gör →
          </Link>
        </CardHeader>
        <CardContent>
          {programs.length === 0 ? (
            <div className="flex flex-col items-center rounded-xl border border-dashed border-blue-200 bg-blue-50/50 py-12 text-center dark:border-blue-800 dark:bg-blue-900/20 animate-scale-in">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Henüz programınız yok.
              </p>
              <Link
                href="/user/my-programs"
                className="mt-4 inline-flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2 text-sm font-medium text-white shadow-md hover:shadow-lg hover:scale-105 transition-all dark:shadow-blue-500/30"
              >
                Programlarım sayfasına git
              </Link>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {programs.map((p, index) => (
                <Link
                  key={p._id}
                  href={`/user/my-programs/${p._id}`}
                  className="group flex items-center justify-between rounded-xl border border-slate-200/60 bg-white/80 backdrop-blur-sm px-4 py-3 transition-all duration-200 hover:border-blue-300 hover:shadow-md hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700/60 dark:bg-slate-800/80 dark:hover:border-blue-600 animate-slide-in-up"
                  style={{ animationDelay: `${350 + index * 50}ms` }}
                >
                  <div className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {p.title}
                    </span>
                    <span className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>{p.days?.length || 0} gün</span>
                      {p.createdBy === "ADMIN" && (
                        <span className="inline-flex rounded-full bg-blue-100 px-2 py-0.5 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
                          PT Atandı
                        </span>
                      )}
                    </span>
                  </div>
                  <span className="ml-2 shrink-0 text-slate-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all dark:text-slate-500 dark:group-hover:text-blue-400">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
