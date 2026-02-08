import { cookies } from "next/headers";
import { getAuthFromCookies } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import AdminSettingsClient from "./AdminSettingsClient";

export default async function AdminSettingsPage() {
  const cookieStore = await cookies();
  const {
    userId,
    name: tokenName,
    email: tokenEmail,
  } = getAuthFromCookies(cookieStore);

  let displayName = tokenName || "";
  let displayEmail = tokenEmail || "";
  if (userId) {
    try {
      await connectDB();
      const user = await User.findById(userId).select("name email").lean();
      if (user?.name?.trim()) displayName = user.name.trim();
      if (user?.email) displayEmail = user.email;
    } catch {
      // token'daki name kullanılmaya devam eder
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200 sm:text-2xl">
        Ayarlar
      </h1>
      <AdminSettingsClient
        initialName={displayName}
        initialEmail={displayEmail}
      />
    </div>
  );
}
