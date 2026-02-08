"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ProgramForm from "@/components/forms/ProgramForm";

function CalendarIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
      />
    </svg>
  );
}

function PlusIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.5v15m7.5-7.5h-15"
      />
    </svg>
  );
}

function ChevronRightIcon({ className }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 4.5l7.5 7.5-7.5 7.5"
      />
    </svg>
  );
}

function EmptyProgramsIllustration() {
  return (
    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
      <CalendarIcon className="h-12 w-12 text-slate-400 dark:text-slate-500" />
    </div>
  );
}

export default function UserProgramsClient() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  async function load() {
    try {
      const res = await fetch("/api/training-programs");
      if (res.ok) setPrograms(await res.json());
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
      <div className="flex min-h-[280px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-emerald-500 dark:border-slate-600 dark:border-t-emerald-400" />
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
            Programlar yükleniyor...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Sayfa başlığı ve aksiyon */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-800 dark:text-slate-100 sm:text-2xl">
            Tüm programlarım
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Antrenman programlarınızı oluşturun ve yönetin.
          </p>
        </div>
        <div className="flex shrink-0">
          <Button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 focus:ring-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            <PlusIcon className="h-5 w-5" />
            {showForm ? "İptal" : "Yeni program"}
          </Button>
        </div>
      </div>

      {/* PT atamalı program uyarısı - yanıp sönen açıklama */}
      {programs.some((p) => p.createdBy === "ADMIN") && (
        <div
          className="flex items-center gap-2 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 dark:border-amber-600 dark:bg-amber-950/40"
          role="alert"
        >
          <span className="text-amber-600 dark:text-amber-400" aria-hidden>
            !
          </span>
          <p className="text-sm font-medium text-amber-800 animate-blink dark:text-amber-200">
            PT tarafından atanan programlarda düzenleme yapılamaz!
          </p>
        </div>
      )}

      {/* Yeni program formu */}
      {showForm && (
        <Card className="overflow-hidden border-emerald-200/60 shadow-md dark:border-emerald-900/40">
          <CardHeader className="border-slate-200/80 bg-slate-50/80 dark:border-slate-700 dark:bg-slate-800/50">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
              Yeni program oluştur
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Başlık ve günleri belirleyin.
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <ProgramForm onSubmit={handleCreate} submitLabel="Oluştur" />
          </CardContent>
        </Card>
      )}

      {/* Program listesi / grid */}
      {programs.length === 0 && !showForm ? (
        <Card className="overflow-hidden border-slate-200/80 dark:border-slate-700/80">
          <CardContent className="flex flex-col items-center justify-center py-16 px-6 text-center sm:py-20">
            <EmptyProgramsIllustration />
            <h3 className="mt-6 text-lg font-semibold text-slate-800 dark:text-slate-100">
              Henüz program yok
            </h3>
            <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">
              İlk antrenman programınızı oluşturarak başlayın. Programınıza gün
              ekleyip antrenmanlarınızı planlayın.
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500"
            >
              <PlusIcon className="h-5 w-5" />
              Yeni program oluştur
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((p) => (
            <Link
              key={p._id}
              href={`/user/my-programs/${p._id}`}
              className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600 dark:hover:shadow-lg"
            >
              <div className="flex flex-1 flex-col">
                <div className="mb-3 flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                    <CalendarIcon className="h-3.5 w-3.5" />
                    {p.days?.length || 0} gün
                  </span>
                  {p.createdBy === "ADMIN" && (
                    <span className="inline-flex items-center rounded-lg bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
                      PT Mert Hoca tarafından atandı
                    </span>
                  )}
                </div>
                <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                  {p.title}
                </h3>
              </div>
              <div className="mt-4 flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400">
                <span>Programa git</span>
                <ChevronRightIcon className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
