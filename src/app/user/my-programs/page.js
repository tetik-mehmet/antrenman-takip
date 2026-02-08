import Link from "next/link";
import UserProgramsClient from "./UserProgramsClient";

export default function UserMyProgramsPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100 sm:text-3xl">
            Programlarım
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Antrenman programlarınızı tek yerden yönetin.
          </p>
        </div>
        <Link
          href="/user"
          className="inline-block shrink-0 text-sm font-medium text-slate-600 underline-offset-4 hover:text-slate-800 hover:underline dark:text-slate-400 dark:hover:text-slate-200"
        >
          ← Anasayfa
        </Link>
      </div>
      <UserProgramsClient />
    </div>
  );
}
