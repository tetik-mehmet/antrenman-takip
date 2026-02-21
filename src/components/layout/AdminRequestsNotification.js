"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function AdminRequestsNotification() {
  const [pendingCount, setPendingCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    async function fetchCount() {
      try {
        const res = await fetch("/api/program-requests?countOnly=true", {
          credentials: "same-origin",
        });
        if (res.ok) {
          const data = await res.json();
          setPendingCount(typeof data?.count === "number" ? data.count : 0);
        }
      } catch {
        setPendingCount(0);
      } finally {
        setLoading(false);
      }
    }
    fetchCount();
    const interval = setInterval(fetchCount, 60_000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => document.removeEventListener("click", handleClickOutside);
  }, [open]);

  return (
    <div className="relative flex items-center" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition-all duration-200 hover:bg-amber-50 hover:text-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 dark:text-slate-300 dark:hover:bg-amber-900/20 dark:hover:text-amber-400 dark:focus:ring-offset-slate-900"
        aria-label={
          pendingCount > 0
            ? `${pendingCount} beklemede talep var`
            : "Talep bildirimleri"
        }
        aria-expanded={open}
        aria-haspopup="true"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
        {pendingCount > 0 && (
          <span
            className="absolute -right-0.5 -top-0.5 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-orange-500 px-1.5 text-xs font-bold text-white shadow-lg ring-2 ring-white dark:ring-slate-900 animate-scale-in"
            aria-hidden
          >
            {pendingCount > 99 ? "99+" : pendingCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full z-50 mt-2 w-72 origin-top-right rounded-2xl border border-slate-200/80 bg-white/95 p-3 shadow-xl backdrop-blur-xl dark:border-slate-700 dark:bg-slate-900/95 animate-scale-in"
          role="menu"
        >
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2 dark:border-slate-700">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/40">
              <svg
                className="h-5 w-5 text-amber-600 dark:text-amber-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                Talepler
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {pendingCount > 0
                  ? `${pendingCount} beklemede talep`
                  : "Bekleyen talep yok"}
              </p>
            </div>
          </div>
          <Link
            href="/admin/requests"
            onClick={() => setOpen(false)}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-2.5 text-sm font-medium text-white shadow-md transition hover:from-amber-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            role="menuitem"
          >
            {pendingCount > 0 ? "Talepleri görüntüle" : "Talepler sayfası"}
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}
