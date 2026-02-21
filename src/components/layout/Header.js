"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import ThemeToggle from "@/components/theme/ThemeToggle";
import AdminRequestsNotification from "@/components/layout/AdminRequestsNotification";

export default function Header({
  title,
  userEmail,
  userName,
  isAdmin,
  onMenuToggle,
  sidebarOpen,
  sidebarCollapsed,
  onSidebarCollapseToggle,
}) {
  const router = useRouter();
  const name = userName?.trim();
  const displayText = name ? `${name} (${userEmail})` : userEmail;

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 border-b border-blue-100/50 bg-white/80 backdrop-blur-lg dark:border-blue-900/30 dark:bg-slate-900/80 transition-all duration-300">
      {/* Gradient accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
      <div className="mx-auto flex h-14 max-w-7xl min-w-0 items-center justify-between gap-2 px-4 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {/* Masaüstü: sidebar kapalıyken açma butonu */}
          {sidebarCollapsed && onSidebarCollapseToggle && (
            <button
              type="button"
              onClick={onSidebarCollapseToggle}
              className="hidden md:flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 dark:text-slate-300 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
              aria-label="Kenar çubuğunu aç"
            >
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}
          {/* Hamburger: sadece md altında (mobil) */}
          {onMenuToggle && (
            <button
              type="button"
              onClick={onMenuToggle}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 dark:text-slate-300 dark:hover:bg-blue-900/20 dark:hover:text-blue-400 md:hidden"
              aria-label={sidebarOpen ? "Menüyü kapat" : "Menüyü aç"}
              aria-expanded={sidebarOpen}
            >
              {sidebarOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          )}
          <Link
            href={isAdmin ? "/admin" : "/user"}
            className="min-w-0 truncate text-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-400 hover:from-blue-700 hover:to-cyan-700 dark:hover:from-blue-300 dark:hover:to-cyan-300 transition-all duration-200"
          >
            {title}
          </Link>
        </div>
        <div className="flex shrink-0 items-center gap-1 sm:gap-3">
          <ThemeToggle />
          {isAdmin && <AdminRequestsNotification />}
          <div className="hidden items-center gap-2 sm:flex">
            {/* User Avatar */}
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 text-xs font-bold text-white shadow-md animate-pulse-glow">
              {name?.charAt(0)?.toUpperCase() || userEmail?.charAt(0)?.toUpperCase() || "?"}
            </div>
            <span
              className="hidden max-w-[180px] truncate text-sm font-medium text-slate-700 dark:text-slate-300 md:block md:max-w-[280px] lg:max-w-none"
              title={userEmail}
            >
              {displayText}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-red-600 hover:bg-red-50 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/20 dark:hover:text-red-300"
          >
            Çıkış
          </Button>
        </div>
      </div>
    </header>
  );
}
