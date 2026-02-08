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
      <section>
        <h2 className="mb-4 text-lg font-semibold text-slate-800 dark:text-slate-100">
          Üyelik Paketleri
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="group relative overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 shadow-lg transition hover:shadow-xl hover:scale-[1.02]">
            <div className="absolute right-0 top-0 h-24 w-24 translate-x-4 -translate-y-4 rounded-full bg-white/10" />
            <div className="relative">
              <span className="text-sm font-medium uppercase tracking-wider text-emerald-100">
                1 Aylık
              </span>
              <p className="mt-2 text-3xl font-bold text-white">₺2.500</p>
              <p className="mt-1 text-sm text-emerald-100/90">
                Kısa süreli deneme
              </p>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-sky-500 to-sky-700 p-6 shadow-lg transition hover:shadow-xl hover:scale-[1.02]">
            <div className="absolute right-0 top-0 h-24 w-24 translate-x-4 -translate-y-4 rounded-full bg-white/10" />
            <div className="relative">
              <span className="text-sm font-medium uppercase tracking-wider text-sky-100">
                3 Aylık
              </span>
              <p className="mt-2 text-3xl font-bold text-white">₺6.000</p>
              <p className="mt-1 text-sm text-sky-100/90">Aylık ₺2.000</p>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-violet-500 to-violet-700 p-6 shadow-lg transition hover:shadow-xl hover:scale-[1.02]">
            <div className="absolute right-0 top-0 h-24 w-24 translate-x-4 -translate-y-4 rounded-full bg-white/10" />
            <div className="relative">
              <span className="text-sm font-medium uppercase tracking-wider text-violet-100">
                6 Aylık
              </span>
              <p className="mt-2 text-3xl font-bold text-white">₺10.000</p>
              <p className="mt-1 text-sm text-violet-100/90">
                Aylık ₺1.667 · Popüler
              </p>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-amber-500 to-amber-700 p-6 shadow-lg transition hover:shadow-xl hover:scale-[1.02]">
            <div className="absolute right-0 top-0 h-24 w-24 translate-x-4 -translate-y-4 rounded-full bg-white/10" />
            <div className="relative">
              <span className="text-sm font-medium uppercase tracking-wider text-amber-100">
                12 Aylık
              </span>
              <p className="mt-2 text-3xl font-bold text-white">₺18.000</p>
              <p className="mt-1 text-sm text-amber-100/90">
                Aylık ₺1.500 · En avantajlı
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Profil kartı */}
      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-700/80 dark:bg-slate-800/50">
        <div className="relative bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 px-6 py-6 dark:from-slate-800/80 dark:via-slate-800 dark:to-emerald-950/20 sm:px-8 sm:py-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-2xl font-bold text-white shadow-lg shadow-emerald-500/25 ring-2 ring-white dark:ring-slate-700"
              aria-hidden
            >
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Profil
              </p>
              <p className="mt-1 text-xl font-semibold text-slate-800 dark:text-slate-100 sm:text-2xl">
                {greeting}
              </p>
              <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                Görünen adınızı aşağıdan güncelleyebilirsiniz.
              </p>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-200/80 px-6 py-5 dark:border-slate-700/80 sm:px-8 sm:py-6">
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
      <Card className="overflow-hidden border-slate-200/80 dark:border-slate-700/80">
        <CardHeader className="flex flex-col gap-2 border-slate-200/80 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700">
          <div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Son programlar
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              En son güncellenen programlarınız.
            </p>
          </div>
          <Link
            href="/user/my-programs"
            className="inline-flex shrink-0 items-center text-sm font-medium text-emerald-600 underline-offset-4 hover:text-emerald-500 hover:underline dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            Tümünü gör →
          </Link>
        </CardHeader>
        <CardContent>
          {programs.length === 0 ? (
            <div className="flex flex-col items-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-12 text-center dark:border-slate-700 dark:bg-slate-800/30">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Henüz programınız yok.
              </p>
              <Link
                href="/user/my-programs"
                className="mt-3 inline-flex items-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500"
              >
                Programlarım sayfasına git
              </Link>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {programs.map((p) => (
                <Link
                  key={p._id}
                  href={`/user/my-programs/${p._id}`}
                  className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 transition hover:border-slate-300 hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-600"
                >
                  <div className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                      {p.title}
                    </span>
                    <span className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span>{p.days?.length || 0} gün</span>
                      {p.createdBy === "ADMIN" && (
                        <span className="inline-flex rounded bg-amber-100 px-1.5 py-0.5 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                          PT Mert Hoca tarafından atandı
                        </span>
                      )}
                    </span>
                  </div>
                  <span className="ml-2 shrink-0 text-slate-400 group-hover:text-emerald-500 dark:text-slate-500 dark:group-hover:text-emerald-400">
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
