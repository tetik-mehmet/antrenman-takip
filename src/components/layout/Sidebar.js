"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar({
  isAdmin,
  isOpen,
  onClose,
  collapsed,
  onCollapseToggle,
}) {
  const pathname = usePathname();

  const links = isAdmin
    ? [
        { href: "/admin", label: "Dashboard" },
        { href: "/admin/users", label: "Kullanıcılar" },
        { href: "/admin/programs", label: "Programlar" },
        { href: "/admin/requests", label: "Talepler" },
        { href: "/admin/settings", label: "Ayarlar" },
      ]
    : [
        {
          href: "/user",
          label: "Anasayfa",
          bg: "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-200 dark:hover:bg-emerald-800/50",
        },
        {
          href: "/user/my-programs",
          label: "Programlarım",
          bg: "bg-amber-100 text-amber-800 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-200 dark:hover:bg-amber-800/50",
        },
      ];

  return (
    <>
      {/* Masaüstü: collapsed durumda sol kenarda açma butonu */}
      {collapsed && (
        <div className="hidden md:flex fixed left-0 top-1/2 -translate-y-1/2 z-30 pl-2">
          <button
            type="button"
            onClick={onCollapseToggle}
            className="flex h-10 w-10 items-center justify-center rounded-r-lg border border-slate-200 border-l-0 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100"
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
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              />
            </svg>
          </button>
        </div>
      )}
      <aside
        className={`
          fixed left-0 top-14 bottom-0 z-20 w-56 shrink-0 border-r border-slate-200 bg-slate-50
          transition-all duration-200 ease-out
          md:relative md:top-0 md:border-r md:bg-slate-50
          dark:border-slate-700 dark:bg-slate-800/50
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          ${
            collapsed
              ? "md:w-0 md:min-w-0 md:overflow-hidden md:border-r-0 md:-ml-0"
              : ""
          }
        `}
      >
        <nav className="flex h-full flex-col gap-1 p-4">
          {/* Kapatma butonu: üstte, hemen görünür */}
          {onCollapseToggle && (
            <button
              type="button"
              onClick={onCollapseToggle}
              className="mb-3 hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-700 md:flex"
              aria-label="Kenar çubuğunu kapat"
              title="Kenar çubuğunu kapat"
            >
              <svg
                className="h-5 w-5 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              </svg>
              <span>◀ Kenarı kapat</span>
            </button>
          )}
          {links.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/user" && pathname?.startsWith(link.href));
            const baseClass =
              "rounded-lg px-3 py-2 text-sm font-medium transition whitespace-nowrap";
            const userClass = link.bg
              ? `${link.bg}${
                  isActive
                    ? " ring-2 ring-offset-2 ring-emerald-500/50 dark:ring-emerald-400/50 dark:ring-offset-slate-800"
                    : ""
                }`
              : "text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700";
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                className={`${baseClass} ${userClass}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
