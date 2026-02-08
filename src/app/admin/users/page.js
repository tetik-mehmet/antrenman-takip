import connectDB from "@/lib/db";
import User from "@/models/User";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

export default async function AdminUsersPage() {
  await connectDB();
  const users = await User.find({})
    .select("-password")
    .sort({ name: 1, email: 1 })
    .lean();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200 sm:text-2xl">
        Kullanıcılar
      </h1>
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            Tüm kullanıcılar (isme göre)
          </h2>
        </CardHeader>
        <CardContent>
          {/* Mobil: kart listesi */}
          <div className="flex flex-col gap-3 md:hidden">
            {users.length === 0 ? (
              <p className="py-4 text-center text-slate-500 dark:text-slate-400">
                Henüz kullanıcı yok.
              </p>
            ) : (
              users.map((u) => (
                <div
                  key={u._id}
                  className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-700 dark:bg-slate-800/30"
                >
                  <p className="font-medium text-slate-800 dark:text-slate-200">
                    {u.name?.trim() || "—"}
                  </p>
                  <p className="mt-0.5 truncate text-sm text-slate-600 dark:text-slate-400">
                    {u.email}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span
                      className={
                        u.role === "ADMIN"
                          ? "rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-200"
                          : "rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                      }
                    >
                      {u.role}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString("tr-TR")
                        : "-"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          {/* Masaüstü: tablo */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full min-w-[300px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="pb-2 pr-4 font-medium text-slate-700 dark:text-slate-300">
                    İsim
                  </th>
                  <th className="pb-2 pr-4 font-medium text-slate-700 dark:text-slate-300">
                    E-posta
                  </th>
                  <th className="pb-2 pr-4 font-medium text-slate-700 dark:text-slate-300">
                    Rol
                  </th>
                  <th className="pb-2 font-medium text-slate-700 dark:text-slate-300">
                    Kayıt tarihi
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u._id}
                    className="border-b border-slate-100 dark:border-slate-700"
                  >
                    <td className="py-3 pr-4 font-medium text-slate-800 dark:text-slate-200">
                      {u.name?.trim() || "—"}
                    </td>
                    <td className="py-3 pr-4 text-slate-800 dark:text-slate-200">
                      {u.email}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={
                          u.role === "ADMIN"
                            ? "rounded bg-amber-100 px-2 py-0.5 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200"
                            : "rounded bg-slate-100 px-2 py-0.5 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                        }
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 text-slate-600 dark:text-slate-400">
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString("tr-TR")
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {users.length === 0 && (
              <p className="py-4 text-center text-slate-500 dark:text-slate-400">
                Henüz kullanıcı yok.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
