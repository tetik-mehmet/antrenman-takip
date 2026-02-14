"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

// Icon Components
const HomeIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const DumbbellIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const ListIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);

const BellIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const DashboardIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

export default function Sidebar({
  isAdmin,
  isOpen,
  onClose,
  collapsed,
  onCollapseToggle,
}) {
  const pathname = usePathname();
  const [hoveredLink, setHoveredLink] = useState(null);

  const links = isAdmin
    ? [
        { href: "/admin", label: "Dashboard", icon: <DashboardIcon /> },
        { href: "/admin/users", label: "Kullanıcılar", icon: <UsersIcon /> },
        { href: "/admin/programs", label: "Programlar", icon: <DumbbellIcon /> },
        { href: "/admin/hareketler", label: "Hareketler", icon: <ListIcon /> },
        { href: "/admin/requests", label: "Talepler", icon: <BellIcon /> },
        { href: "/admin/settings", label: "Ayarlar", icon: <SettingsIcon /> },
      ]
    : [
        {
          href: "/user",
          label: "Anasayfa",
          icon: <HomeIcon />,
        },
        {
          href: "/user/my-programs",
          label: "Programlarım",
          icon: <DumbbellIcon />,
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
            className="flex h-10 w-10 items-center justify-center rounded-r-lg border border-blue-200 border-l-0 bg-white/90 backdrop-blur-sm text-blue-600 shadow-md transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 hover:shadow-lg dark:border-blue-800 dark:bg-slate-800/90 dark:text-blue-400 dark:hover:bg-slate-700 dark:hover:text-blue-300"
            aria-label="Kenar çubuğunu aç"
          >
            <svg
              className="h-5 w-5 transition-transform group-hover:scale-110"
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
          fixed left-0 top-14 bottom-0 z-20 w-64 shrink-0 border-r border-slate-200/60 bg-gradient-to-b from-slate-50 to-white
          transition-all duration-300 ease-in-out
          md:relative md:top-0 md:border-r
          dark:border-slate-700/60 dark:from-slate-900/50 dark:to-slate-800/50 backdrop-blur-sm
          ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full md:translate-x-0"}
          ${
            collapsed
              ? "md:w-0 md:min-w-0 md:overflow-hidden md:border-r-0 md:-ml-0"
              : ""
          }
        `}
      >
        <nav className="flex h-full flex-col gap-1.5 p-4">
          {/* Kapatma butonu: üstte */}
          {onCollapseToggle && (
            <button
              type="button"
              onClick={onCollapseToggle}
              className="group mb-3 hidden items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-blue-50 hover:text-blue-700 dark:text-slate-400 dark:hover:bg-blue-900/20 dark:hover:text-blue-300 md:flex"
              aria-label="Kenar çubuğunu kapat"
              title="Kenar çubuğunu kapat"
            >
              <svg
                className="h-5 w-5 shrink-0 transition-transform group-hover:-translate-x-1"
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
              <span>Gizle</span>
            </button>
          )}
          
          {links.map((link, index) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/user" && pathname?.startsWith(link.href));
            
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={onClose}
                onMouseEnter={() => setHoveredLink(index)}
                onMouseLeave={() => setHoveredLink(null)}
                className={`
                  group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200
                  ${
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30 translate-x-1"
                      : "text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:translate-x-1 hover:shadow-md dark:text-slate-300 dark:hover:bg-blue-900/20 dark:hover:text-blue-300"
                  }
                  animate-slide-in-left
                `}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span className={`flex-shrink-0 transition-transform duration-200 ${hoveredLink === index ? "scale-110 rotate-3" : ""}`}>
                  {link.icon}
                </span>
                <span className="flex-1">{link.label}</span>
                {isActive && (
                  <span className="absolute right-2 h-2 w-2 rounded-full bg-white animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
