"use client";

import Link from "next/link";

export default function Sidebar({ isAdmin, isOpen, onClose }) {
  const links = isAdmin
    ? [
        { href: "/admin", label: "Dashboard" },
        { href: "/admin/users", label: "Kullanıcılar" },
        { href: "/admin/programs", label: "Programlar" },
        { href: "/admin/requests", label: "Talepler" },
        { href: "/admin/settings", label: "Ayarlar" },
      ]
    : [
        { href: "/user", label: "Anasayfa" },
        { href: "/user/my-programs", label: "Programlarım" },
      ];

  return (
    <aside
      className={`
        fixed left-0 top-14 bottom-0 z-20 w-56 shrink-0 border-r border-slate-200 bg-slate-50
        transition-transform duration-200 ease-out
        md:relative md:top-0 md:translate-x-0 md:border-r md:bg-slate-50
        dark:border-slate-700 dark:bg-slate-800/50
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}
    >
      <nav className="flex flex-col gap-1 p-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
