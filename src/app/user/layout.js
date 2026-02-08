import { cookies } from "next/headers";
import { getAuthFromCookies } from "@/lib/auth";
import DashboardLayout from "@/components/layout/DashboardLayout";
import connectDB from "@/lib/db";
import User from "@/models/User";

export default async function UserLayout({ children }) {
  const cookieStore = await cookies();
  const { userId, email, name: tokenName } = getAuthFromCookies(cookieStore);

  let displayName = tokenName || "";
  if (userId) {
    try {
      await connectDB();
      const user = await User.findById(userId).select("name").lean();
      if (user?.name?.trim()) displayName = user.name.trim();
    } catch {
      // token'daki name kullanılmaya devam eder
    }
  }

  return (
    <DashboardLayout
      title="Antrenman Programlarım"
      userEmail={email || ""}
      userName={displayName}
      isAdmin={false}
    >
      {children}
    </DashboardLayout>
  );
}
