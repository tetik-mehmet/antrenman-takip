"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/Card";

const statusLabels = {
  PENDING: "Beklemede",
  IN_PROGRESS: "İşleniyor",
  DONE: "Program yazıldı",
};

const STATUS_OPTIONS = [
  { value: "PENDING", label: "Beklemede" },
  { value: "IN_PROGRESS", label: "İşleniyor" },
  { value: "DONE", label: "Program yazıldı" },
];

const statusStyles = {
  PENDING:
    "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-600 dark:bg-amber-950/40 dark:text-amber-200",
  IN_PROGRESS:
    "border-blue-300 bg-blue-50 text-blue-800 dark:border-blue-600 dark:bg-blue-950/40 dark:text-blue-200",
  DONE: "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-200",
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("tr-TR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminRequestsClient() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  async function handleStatusChange(requestId, newStatus) {
    setUpdatingId(requestId);
    try {
      const res = await fetch(`/api/program-requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
        credentials: "same-origin",
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Durum güncellenemedi.");
        return;
      }
      setRequests((prev) => prev.map((r) => (r._id === requestId ? data : r)));
      toast.success("Durum güncellendi");
    } catch {
      toast.error("Bağlantı hatası.");
    } finally {
      setUpdatingId(null);
    }
  }

  async function load() {
    try {
      const res = await fetch("/api/program-requests");
      if (res.ok) {
        const data = await res.json();
        setRequests(Array.isArray(data) ? data : []);
      } else {
        setRequests([]);
      }
    } catch (err) {
      console.error("Talepler yüklenemedi:", err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400">Yükleniyor...</p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <Card className="border-slate-200 dark:border-slate-700">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 rounded-full bg-slate-100 p-4 dark:bg-slate-700">
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
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
          </div>
          <p className="text-slate-600 dark:text-slate-400">
            Henüz program talebi yok.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {requests.map((req) => {
        const user = req.userId;
        const displayName = user?.name || user?.email || "İsimsiz";
        const email = user?.email || "";

        return (
          <Card
            key={req._id}
            className="overflow-hidden border-slate-200 dark:border-slate-700"
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-700">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-slate-600 dark:bg-slate-600 dark:text-slate-300">
                  {(displayName || "?").charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold text-slate-800 dark:text-slate-200">
                    {displayName}
                  </p>
                  {email && (
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                      {email}
                    </p>
                  )}
                </div>
                <select
                  value={req.status || "PENDING"}
                  onChange={(e) => handleStatusChange(req._id, e.target.value)}
                  disabled={updatingId === req._id}
                  className={`shrink-0 cursor-pointer rounded border px-2 py-1 text-xs font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-70 sm:min-w-[150px] ${
                    statusStyles[req.status] || statusStyles.PENDING
                  }`}
                  aria-label="Talep durumu"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="px-4 py-3">
                <p className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-300">
                  {req.notes}
                </p>
                <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                  {formatDate(req.createdAt)}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
