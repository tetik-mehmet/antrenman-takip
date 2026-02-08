import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-100 px-4 dark:bg-slate-900">
      <main className="max-w-md rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-lg dark:border-slate-700 dark:bg-slate-800 sm:p-8">
        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200 sm:text-2xl">
          Antrenman Programı Yönetimi
        </h1>
        <p className="mt-2 text-slate-600 dark:text-slate-400">
          Giriş yaparak programlarınıza erişin veya yeni hesap oluşturun.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 dark:bg-slate-600 dark:hover:bg-slate-500"
          >
            Giriş yap
          </Link>
          <Link
            href="/register"
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            Kayıt ol
          </Link>
        </div>
      </main>
    </div>
  );
}
