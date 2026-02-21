"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import ProgramForm from "@/components/forms/ProgramForm";

const AVATAR_GRADIENTS = [
  "from-violet-500 to-purple-600",
  "from-cyan-500 to-blue-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-indigo-500 to-blue-600",
  "from-teal-500 to-cyan-600",
  "from-orange-500 to-amber-600",
];

function getAvatarGradient(str) {
  if (!str) return AVATAR_GRADIENTS[0];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = (hash << 5) - hash + str.charCodeAt(i);
  const idx = Math.abs(hash) % AVATAR_GRADIENTS.length;
  return AVATAR_GRADIENTS[idx];
}

function UserProgramCard({ group }) {
  const displayName = group.user?.name || group.user?.email || "İsimsiz";
  const userRole = group.user?.role || "USER";
  const count = group.programs.length;
  const gradient = getAvatarGradient(group.user?._id || displayName);
  const initial = (displayName || "?").charAt(0).toUpperCase();

  return (
    <Card className="overflow-hidden rounded-2xl border-2 border-slate-200/80 bg-white shadow-md shadow-slate-200/30 ring-1 ring-slate-100 dark:border-slate-600 dark:bg-slate-800/95 dark:shadow-slate-900/40 dark:ring-slate-700/50">
      <div className="flex flex-col">
        <div className="flex items-center gap-3 p-4">
          <div className="relative shrink-0">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-lg font-bold text-white shadow-md`}
            >
              {initial}
            </div>
            <span
              className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-800"
              title="Aktif"
              aria-hidden
            />
          </div>
          <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            <p className="truncate font-semibold text-slate-800 dark:text-slate-200">
              {displayName}
            </p>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                userRole === "ADMIN"
                  ? "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                  : "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300"
              }`}
              aria-label={userRole === "ADMIN" ? "Koç" : "Üye"}
            >
              {userRole === "ADMIN" ? "Koç" : "Üye"}
            </span>
            <span
              className="shrink-0 rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-600 dark:text-slate-200"
              aria-label={`${count} program`}
            >
              {count} Program
            </span>
          </div>
        </div>

        <div className="border-t border-slate-200 bg-slate-50/50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/50">
          <ul className="space-y-1.5">
            {group.programs.map((p) => {
              const dayCount = p.days?.length || 0;
              return (
                <li key={p._id}>
                  <Link
                    href={`/admin/programs/${p._id}`}
                    className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-white hover:shadow-sm dark:text-slate-300 dark:hover:bg-slate-700"
                  >
                    <span className="truncate">{p.title}</span>
                    <span
                      className="shrink-0 rounded-full bg-slate-200/80 px-2 py-0.5 text-xs font-medium text-slate-600 dark:bg-slate-600/80 dark:text-slate-300"
                      aria-label={`${dayCount} gün`}
                    >
                      {dayCount} Gün
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Card>
  );
}

export default function AdminProgramsClient() {
  const [programs, setPrograms] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [nameFilter, setNameFilter] = useState("");

  const groupedByUser = useMemo(() => {
    const map = new Map();
    for (const p of programs) {
      const uid = p.userId?._id != null ? String(p.userId._id) : null;
      if (!uid) continue;
      if (!map.has(uid)) {
        map.set(uid, { user: p.userId, programs: [] });
      }
      map.get(uid).programs.push(p);
    }
    return Array.from(map.entries()).map(([, data]) => data);
  }, [programs]);

  const filteredByUser = useMemo(() => {
    if (!nameFilter.trim()) return groupedByUser;
    const q = nameFilter.trim().toLowerCase();
    return groupedByUser.filter((group) => {
      const displayName = (
        group.user?.name ||
        group.user?.email ||
        ""
      ).toLowerCase();
      return displayName.includes(q);
    });
  }, [groupedByUser, nameFilter]);

  const stats = useMemo(() => {
    let totalPrograms = 0;
    let totalDays = 0;
    let activePrograms = 0;
    for (const g of filteredByUser) {
      for (const p of g.programs) {
        totalPrograms += 1;
        const dayCount = p.days?.length || 0;
        totalDays += dayCount;
        const hasContent = dayCount > 0 && (p.days || []).some((d) => (d.exercises?.length || 0) > 0);
        if (hasContent) activePrograms += 1;
      }
    }
    return {
      totalMembers: filteredByUser.length,
      totalPrograms,
      activePrograms: activePrograms || totalPrograms,
      totalDays,
    };
  }, [filteredByUser]);

  async function load() {
    try {
      const [progRes, userRes] = await Promise.all([
        fetch("/api/training-programs"),
        fetch("/api/users"),
      ]);
      if (progRes.ok) {
        const data = await progRes.json();
        setPrograms(Array.isArray(data) ? data : []);
      }
      if (userRes.ok) {
        const data = await userRes.json();
        setUsers(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Programlar yüklenemedi:", err);
      setPrograms([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate(payload) {
    const res = await fetch("/api/training-programs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: payload.title,
        targetUserId: payload.targetUserId,
        days: payload.days,
      }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Oluşturulamadı");
    }
    setShowForm(false);
    load();
  }

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400">Yükleniyor...</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200 sm:text-2xl">
          Tüm programlar
        </h2>
        <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-4">
          <div className="relative w-full sm:max-w-xs">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </span>
            <input
              type="text"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              placeholder="İsme göre ara..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-slate-500 dark:focus:ring-slate-700"
            />
            {nameFilter && (
              <button
                type="button"
                onClick={() => setNameFilter("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-600 dark:hover:text-slate-300"
                aria-label="Filtreyi temizle"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setShowForm(!showForm)}
            className={
              showForm
                ? "inline-flex items-center justify-center gap-2 rounded-xl border-2 border-slate-300 bg-slate-100 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                : "inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-cyan-500/40 transition-all hover:scale-105 hover:shadow-xl hover:shadow-cyan-500/50 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 dark:shadow-cyan-600/30 dark:hover:shadow-cyan-500/40"
            }
          >
            {showForm ? (
              "İptal"
            ) : (
              <>
                <svg className="h-5 w-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                Yeni program ata
              </>
            )}
          </button>
        </div>
      </div>

      {/* İstatistik barı - dashboard havası */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border-2 border-slate-200/80 bg-white px-4 py-4 shadow-md shadow-slate-200/30 ring-1 ring-slate-100 transition-shadow hover:shadow-lg dark:border-slate-600 dark:bg-slate-800/95 dark:shadow-slate-900/40 dark:ring-slate-700/50">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Toplam Üye</p>
          <p className="mt-1 text-2xl font-bold text-slate-800 dark:text-slate-100 sm:text-3xl">{stats.totalMembers}</p>
        </div>
        <div className="rounded-2xl border-2 border-slate-200/80 bg-white px-4 py-4 shadow-md shadow-slate-200/30 ring-1 ring-slate-100 transition-shadow hover:shadow-lg dark:border-slate-600 dark:bg-slate-800/95 dark:shadow-slate-900/40 dark:ring-slate-700/50">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Toplam Program</p>
          <p className="mt-1 text-2xl font-bold text-slate-800 dark:text-slate-100 sm:text-3xl">{stats.totalPrograms}</p>
        </div>
        <div className="rounded-2xl border-2 border-slate-200/80 bg-white px-4 py-4 shadow-md shadow-slate-200/30 ring-1 ring-slate-100 transition-shadow hover:shadow-lg dark:border-slate-600 dark:bg-slate-800/95 dark:shadow-slate-900/40 dark:ring-slate-700/50">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Aktif Program</p>
          <p className="mt-1 text-2xl font-bold text-slate-800 dark:text-slate-100 sm:text-3xl">{stats.activePrograms}</p>
        </div>
      </div>

      {showForm && (
        <Card className="mb-6 rounded-2xl border-2 border-emerald-200/80 bg-emerald-50/80 shadow-md shadow-emerald-200/20 dark:border-emerald-700/60 dark:bg-emerald-950/40 dark:shadow-emerald-900/20">
          <CardHeader>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              Yeni program oluştur
            </h3>
          </CardHeader>
          <CardContent>
            <ProgramForm
              targetUserOptions={users}
              onSubmit={handleCreate}
              submitLabel="Program oluştur"
            />
          </CardContent>
        </Card>
      )}

      {filteredByUser.length === 0 && !showForm ? (
        <Card className="rounded-2xl border-2 border-slate-200/80 bg-white shadow-md shadow-slate-200/30 dark:border-slate-600 dark:bg-slate-800/95 dark:shadow-slate-900/40">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-slate-100 p-4 dark:bg-slate-700">
              {nameFilter ? (
                <svg
                  className="h-10 w-10 text-slate-400 dark:text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="h-10 w-10 text-slate-400 dark:text-slate-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              )}
            </div>
            <p className="text-slate-600 dark:text-slate-400">
              {nameFilter
                ? `"${nameFilter}" ile eşleşen kullanıcı bulunamadı.`
                : "Henüz program yok. Yeni program ata ile oluşturun."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredByUser.map((group, index) => (
            <UserProgramCard key={`user-card-${index}`} group={group} />
          ))}
        </div>
      )}

      {/* Floating Action Button - mobilde hızlı erişim */}
      <button
        type="button"
        onClick={() => setShowForm(!showForm)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-600 text-white shadow-xl shadow-cyan-500/40 transition-all hover:scale-110 hover:shadow-2xl hover:shadow-cyan-500/50 focus:outline-none focus:ring-4 focus:ring-cyan-400/50 focus:ring-offset-2 sm:hidden"
        aria-label={showForm ? "Formu kapat" : "Yeni program ata"}
      >
        {showForm ? (
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
        )}
      </button>
    </>
  );
}
