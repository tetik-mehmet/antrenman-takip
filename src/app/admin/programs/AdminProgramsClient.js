"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ProgramForm from "@/components/forms/ProgramForm";

function UserProgramCard({ group }) {
  const displayName = group.user?.name || group.user?.email || "İsimsiz";
  const count = group.programs.length;

  return (
    <Card className="overflow-hidden border-slate-200 dark:border-slate-700">
      <div className="flex flex-col">
        <div className="flex items-center gap-3 p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-lg font-bold text-slate-600 dark:bg-slate-600 dark:text-slate-300">
            {(displayName || "?").charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-800 dark:text-slate-200">
              {displayName}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {count} program
            </p>
          </div>
        </div>

        <div className="border-t border-slate-200 bg-slate-50/50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800/50">
          <ul className="space-y-1.5">
            {group.programs.map((p) => (
              <li key={p._id}>
                <Link
                  href={`/admin/programs/${p._id}`}
                  className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-white hover:shadow-sm dark:text-slate-300 dark:hover:bg-slate-700"
                >
                  <span className="truncate">{p.title}</span>
                  <span className="shrink-0 text-xs text-slate-500 dark:text-slate-400">
                    {p.days?.length || 0} gün
                  </span>
                </Link>
              </li>
            ))}
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
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? "İptal" : "Yeni program ata"}
          </Button>
        </div>
      </div>

      {showForm && (
        <Card className="mb-6 border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/30">
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
        <Card className="border-slate-200 dark:border-slate-700">
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
    </>
  );
}
