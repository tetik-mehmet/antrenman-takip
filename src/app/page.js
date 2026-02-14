import Link from "next/link";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50/40 px-4 dark:from-slate-950 dark:via-blue-950/30 dark:to-slate-900">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl animate-float dark:bg-blue-600/10" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl animate-float dark:bg-cyan-600/10" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-blue-300/5 blur-3xl animate-pulse" />
      </div>

      <main className="relative z-10 max-w-lg animate-scale-in">
        <div className="rounded-3xl border border-slate-200/60 bg-white/95 backdrop-blur-xl p-8 text-center shadow-2xl shadow-slate-500/10 dark:border-slate-700/50 dark:bg-slate-800/90 sm:p-10">
          {/* Icon/Logo placeholder */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 shadow-lg shadow-blue-500/50 animate-pulse-glow">
            <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-400 sm:text-3xl animate-slide-in-up">
            Antrenman Programı Yönetimi
          </h1>
          <p className="mt-3 text-slate-600 dark:text-slate-300 animate-slide-in-up" style={{ animationDelay: "100ms" }}>
            Giriş yaparak programlarınıza erişin veya yeni hesap oluşturun.
          </p>
          
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center animate-slide-in-up" style={{ animationDelay: "200ms" }}>
            <Link
              href="/login"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/50 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/60 dark:shadow-blue-500/30"
            >
              <span>Giriş yap</span>
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/register"
              className="group inline-flex items-center justify-center gap-2 rounded-xl border-2 border-blue-500 bg-white/50 px-6 py-3 text-sm font-semibold text-blue-600 backdrop-blur-sm transition-all duration-200 hover:scale-105 hover:bg-blue-50 hover:shadow-lg dark:border-blue-400 dark:bg-slate-800/50 dark:text-blue-400 dark:hover:bg-blue-900/30"
            >
              <span>Kayıt ol</span>
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </Link>
          </div>

          {/* Feature highlights */}
          <div className="mt-8 grid grid-cols-3 gap-4 border-t border-slate-200/50 pt-6 dark:border-slate-700/50 animate-slide-in-up" style={{ animationDelay: "300ms" }}>
            <div className="text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Programlar</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Takip</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <p className="text-xs font-medium text-slate-600 dark:text-slate-400">Gelişim</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
