"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";

export default function Header({
  title,
  userEmail,
  userName,
  isAdmin,
  onMenuToggle,
  sidebarOpen,
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
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-700 dark:bg-slate-900/95">
      <div className="mx-auto flex h-14 max-w-7xl min-w-0 items-center justify-between gap-2 px-4 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {/* Hamburger: sadece md altında */}
          {onMenuToggle && (
            <button
              type="button"
              onClick={onMenuToggle}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden"
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
            className="min-w-0 truncate text-lg font-semibold text-slate-800 dark:text-slate-200"
          >
            {title}
          </Link>
        </div>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <span
            className="hidden max-w-[180px] truncate text-sm text-slate-600 dark:text-slate-400 sm:block md:max-w-[280px] lg:max-w-none"
            title={userEmail}
          >
            {displayText}
          </span>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="min-h-[44px]"
          >
            Çıkış
          </Button>
        </div>
      </div>
    </header>
  );
}
