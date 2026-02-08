"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import ProgramForm from "@/components/forms/ProgramForm";
import Alert from "@/components/ui/Alert";

export default function ProgramDetail({ program, canEdit, backHref }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [assignLoading, setAssignLoading] = useState(false);
  const [assignError, setAssignError] = useState("");
  const [assignSuccess, setAssignSuccess] = useState("");

  const programId = program._id;
  const ownerId = program.userId?._id ? String(program.userId._id) : null;

  async function handleUpdate(payload) {
    const res = await fetch(`/api/training-programs/${programId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: payload.title, days: payload.days }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Güncellenemedi");
    }
    setEditing(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Bu programı silmek istediğinize emin misiniz?")) return;
    setDeleting(true);
    const res = await fetch(`/api/training-programs/${programId}`, {
      method: "DELETE",
    });
    setDeleting(false);
    if (!res.ok) {
      const data = await res.json();
      alert(data.message || "Silinemedi");
      return;
    }
    router.push(backHref || "/user/my-programs");
    router.refresh();
  }

  useEffect(() => {
    if (!assignModalOpen || !canEdit) return;
    setUsersLoading(true);
    setAssignError("");
    setAssignSuccess("");
    setSelectedUserIds([]);
    fetch("/api/users")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setUsers(Array.isArray(data) ? data : []))
      .catch(() => setUsers([]))
      .finally(() => setUsersLoading(false));
  }, [assignModalOpen, canEdit]);

  function toggleUser(id) {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  async function handleAssign() {
    if (selectedUserIds.length === 0) {
      setAssignError("En az bir kullanıcı seçin.");
      return;
    }
    setAssignLoading(true);
    setAssignError("");
    setAssignSuccess("");
    try {
      const res = await fetch(`/api/training-programs/${programId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetUserIds: selectedUserIds }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAssignError(data.message || "Atama yapılamadı.");
        return;
      }
      setAssignSuccess(
        data.message || `Program ${data.count} kullanıcıya atandı.`
      );
      router.refresh();
      setTimeout(() => {
        setAssignModalOpen(false);
      }, 1500);
    } catch (err) {
      setAssignError(err.message || "Bir hata oluştu.");
    } finally {
      setAssignLoading(false);
    }
  }

  if (editing) {
    return (
      <Card>
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            Programı düzenle
          </h2>
          <Button
            variant="secondary"
            onClick={() => setEditing(false)}
            className="w-full sm:w-auto"
          >
            İptal
          </Button>
        </CardHeader>
        <CardContent>
          <ProgramForm
            initialTitle={program.title}
            initialDays={program.days || []}
            onSubmit={handleUpdate}
            submitLabel="Güncelle"
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {!canEdit && (
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
      <div className="flex flex-wrap gap-2">
        {canEdit && (
          <>
            <Button onClick={() => setEditing(true)}>Düzenle</Button>
            <Button
              variant="secondary"
              onClick={() => setAssignModalOpen(true)}
            >
              Başka kullanıcılara ata
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Siliniyor..." : "Sil"}
            </Button>
          </>
        )}
        <Link href={backHref || "/user/my-programs"} className="inline-block">
          <Button variant="secondary">Listeye dön</Button>
        </Link>
      </div>

      {canEdit && assignModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="assign-modal-title"
        >
          <div
            className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/70"
            onClick={() => !assignLoading && setAssignModalOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-md max-h-[90vh] flex flex-col rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800">
            <div className="shrink-0 border-b border-slate-200 px-4 py-3 dark:border-slate-700">
              <h2
                id="assign-modal-title"
                className="text-lg font-semibold text-slate-800 dark:text-slate-200"
              >
                Bu programı kullanıcılara ata
              </h2>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
              {usersLoading ? (
                <p className="py-6 text-center text-slate-500 dark:text-slate-400">
                  Kullanıcılar yükleniyor...
                </p>
              ) : users.length === 0 ? (
                <p className="py-6 text-center text-slate-500 dark:text-slate-400">
                  Kullanıcı bulunamadı.
                </p>
              ) : (
                <ul className="space-y-1">
                  {users.map((u) => {
                    const uid = String(u._id);
                    const isOwner = uid === ownerId;
                    const label = u.name?.trim() || u.email || uid;
                    return (
                      <li key={u._id}>
                        <label
                          className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                            isOwner
                              ? "cursor-not-allowed opacity-60"
                              : "hover:bg-slate-100 dark:hover:bg-slate-700"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={selectedUserIds.includes(uid)}
                            onChange={() => !isOwner && toggleUser(uid)}
                            disabled={isOwner}
                            className="h-4 w-4 rounded border-slate-300 text-slate-600 focus:ring-slate-500 dark:border-slate-600 dark:bg-slate-700"
                          />
                          <span className="text-slate-800 dark:text-slate-200">
                            {label}
                          </span>
                          {isOwner && (
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                              (bu programın sahibi)
                            </span>
                          )}
                        </label>
                      </li>
                    );
                  })}
                </ul>
              )}
              {assignError && (
                <Alert variant="error" className="mt-3">
                  {assignError}
                </Alert>
              )}
              {assignSuccess && (
                <Alert variant="success" className="mt-3">
                  {assignSuccess}
                </Alert>
              )}
            </div>
            <div className="shrink-0 flex flex-col gap-2 border-t border-slate-200 px-4 py-3 dark:border-slate-700 sm:flex-row sm:justify-end">
              <Button
                variant="secondary"
                onClick={() => !assignLoading && setAssignModalOpen(false)}
                disabled={assignLoading}
                className="w-full sm:w-auto"
              >
                İptal
              </Button>
              <Button
                onClick={handleAssign}
                disabled={
                  usersLoading || assignLoading || selectedUserIds.length === 0
                }
                className="w-full sm:w-auto"
              >
                {assignLoading ? "Atanıyor..." : "Seçilenlere ata"}
              </Button>
            </div>
          </div>
        </div>
      )}
      {program.userId?.email && (
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Kullanıcı: {program.userId.email}
        </p>
      )}
      <div className="space-y-4">
        {(program.days || []).map((day, dayIndex) => (
          <Card key={dayIndex}>
            <CardHeader>
              <h3 className="font-semibold text-slate-800 dark:text-slate-200">
                {day.dayName || `Gün ${dayIndex + 1}`}
              </h3>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {(day.exercises || []).map((ex, exIndex) => (
                  <li
                    key={exIndex}
                    className="flex flex-col gap-1 rounded border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-600 dark:bg-slate-800/50 sm:flex-row sm:flex-wrap sm:items-center sm:gap-2"
                  >
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      {ex.name || "Egzersiz"}
                    </span>
                    <span className="text-slate-600 dark:text-slate-400">
                      {ex.sets} set × {ex.reps} tekrar
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
