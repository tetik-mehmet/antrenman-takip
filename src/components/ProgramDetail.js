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
  const [movements, setMovements] = useState([]);
  const [reorderModalOpen, setReorderModalOpen] = useState(false);
  const [reorderDays, setReorderDays] = useState([]);
  const [reorderLoading, setReorderLoading] = useState(false);

  const programId = program._id;
  const ownerId = program.userId?._id ? String(program.userId._id) : null;

  function getEmbedUrl(url) {
    if (!url) return "";
    try {
      const parsed = new URL(url);
      const host = parsed.hostname.toLowerCase();

      // YouTube klasik URL: https://www.youtube.com/watch?v=ID
      if (host.includes("youtube.com")) {
        const v = parsed.searchParams.get("v");
        if (v) {
          return `https://www.youtube.com/embed/${v}`;
        }
        // Zaten embed veya /shorts gibi durumlar
        if (parsed.pathname.startsWith("/embed/")) {
          return url;
        }
        if (parsed.pathname.startsWith("/shorts/")) {
          const id = parsed.pathname.split("/").filter(Boolean).pop();
          return id ? `https://www.youtube.com/embed/${id}` : url;
        }
      }

      // Kısa YouTube URL: https://youtu.be/ID
      if (host === "youtu.be") {
        const id = parsed.pathname.split("/").filter(Boolean).pop();
        return id ? `https://www.youtube.com/embed/${id}` : url;
      }

      // Diğer siteler için olduğu gibi bırak (site iframe'e izin vermeyebilir)
      return url;
    } catch {
      return url;
    }
  }

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

  useEffect(() => {
    // Kullanıcılar da hareketleri görebilsin diye sadece GET çağrısı yapıyoruz
    fetch("/api/movements")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (Array.isArray(data)) {
          setMovements(data);
        }
      })
      .catch(() => {
        // Hata durumunda video göstermeden devam ederiz
      });
  }, []);

  function openReorderModal() {
    setReorderDays(JSON.parse(JSON.stringify(program.days || [])));
    setReorderModalOpen(true);
  }

  function closeReorderModal() {
    setReorderModalOpen(false);
    setReorderDays([]);
  }

  function moveDayUp(dayIndex) {
    if (dayIndex === 0) return;
    setReorderDays((days) => {
      const next = [...days];
      [next[dayIndex - 1], next[dayIndex]] = [next[dayIndex], next[dayIndex - 1]];
      return next;
    });
  }

  function moveDayDown(dayIndex) {
    if (dayIndex === reorderDays.length - 1) return;
    setReorderDays((days) => {
      const next = [...days];
      [next[dayIndex], next[dayIndex + 1]] = [next[dayIndex + 1], next[dayIndex]];
      return next;
    });
  }

  function moveExerciseUp(dayIndex, exIndex) {
    if (exIndex === 0) return;
    setReorderDays((days) => {
      return days.map((day, i) => {
        if (i !== dayIndex) return day;
        const exercises = [...day.exercises];
        [exercises[exIndex - 1], exercises[exIndex]] = [exercises[exIndex], exercises[exIndex - 1]];
        return { ...day, exercises };
      });
    });
  }

  function moveExerciseDown(dayIndex, exIndex) {
    const day = reorderDays[dayIndex];
    if (!day || exIndex === day.exercises.length - 1) return;
    setReorderDays((days) => {
      return days.map((d, i) => {
        if (i !== dayIndex) return d;
        const exercises = [...d.exercises];
        [exercises[exIndex], exercises[exIndex + 1]] = [exercises[exIndex + 1], exercises[exIndex]];
        return { ...d, exercises };
      });
    });
  }

  async function saveReorder() {
    setReorderLoading(true);
    try {
      const res = await fetch(`/api/training-programs/${programId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: program.title, days: reorderDays }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Güncellenemedi");
      }
      closeReorderModal();
      router.refresh();
    } catch (err) {
      alert(err.message || "Sıralama kaydedilemedi");
    } finally {
      setReorderLoading(false);
    }
  }

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
      <Card variant="glass" className="animate-scale-in">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-400">
            Programı düzenle
          </h2>
          <Button
            variant="tertiary"
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
    <div className="space-y-4 animate-fade-in">
      {!canEdit && (
        <div
          className="flex items-center gap-3 rounded-xl border border-blue-300 bg-blue-50/80 backdrop-blur-sm px-4 py-3 shadow-md dark:border-blue-600 dark:bg-blue-950/40 animate-slide-in-up"
          role="alert"
        >
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/40">
            <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
            PT tarafından atanan programlarda düzenleme yapılamaz!
          </p>
        </div>
      )}
      <div className="flex flex-wrap gap-2 animate-slide-in-up" style={{ animationDelay: "100ms" }}>
        {canEdit && (
          <>
            <Button onClick={() => setEditing(true)}>Düzenle</Button>
            <Button
              variant="secondary"
              onClick={openReorderModal}
            >
              Sırayı düzenle
            </Button>
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

      {canEdit && reorderModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reorder-modal-title"
        >
          <div
            className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/70"
            onClick={() => !reorderLoading && closeReorderModal()}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-4xl max-h-[90vh] flex flex-col rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800">
            <div className="shrink-0 border-b border-slate-200 px-4 py-3 dark:border-slate-700">
              <h2
                id="reorder-modal-title"
                className="text-lg font-semibold text-slate-800 dark:text-slate-200"
              >
                Sırayı Düzenle
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                Yukarı/Aşağı ok butonlarına tıklayarak günleri ve egzersizleri yeniden sıralayın
              </p>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {reorderDays.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className="rounded-lg border-2 border-slate-200 bg-slate-50 dark:border-slate-600 dark:bg-slate-700/50 transition-all"
                >
                  <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-600 px-3 py-2.5 bg-slate-100 dark:bg-slate-700">
                    <div className="flex flex-col gap-0.5">
                      <button
                        type="button"
                        onClick={() => moveDayUp(dayIndex)}
                        disabled={dayIndex === 0}
                        className="p-0.5 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Günü yukarı taşı"
                      >
                        <svg
                          className="h-4 w-4 text-slate-600 dark:text-slate-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={() => moveDayDown(dayIndex)}
                        disabled={dayIndex === reorderDays.length - 1}
                        className="p-0.5 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        title="Günü aşağı taşı"
                      >
                        <svg
                          className="h-4 w-4 text-slate-600 dark:text-slate-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                    <span className="font-semibold text-slate-800 dark:text-slate-200 flex-1">
                      {day.dayName || `Gün ${dayIndex + 1}`}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {day.exercises?.length || 0} egzersiz
                    </span>
                  </div>
                  <div className="p-2 space-y-2">
                    {(day.exercises || []).map((ex, exIndex) => (
                      <div
                        key={exIndex}
                        className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-600 dark:bg-slate-800 transition-all"
                      >
                        <div className="flex flex-col gap-0.5">
                          <button
                            type="button"
                            onClick={() => moveExerciseUp(dayIndex, exIndex)}
                            disabled={exIndex === 0}
                            className="p-0.5 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title="Egzersizi yukarı taşı"
                          >
                            <svg
                              className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            onClick={() => moveExerciseDown(dayIndex, exIndex)}
                            disabled={exIndex === day.exercises.length - 1}
                            className="p-0.5 rounded hover:bg-blue-100 dark:hover:bg-blue-900/30 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                            title="Egzersizi aşağı taşı"
                          >
                            <svg
                              className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-medium text-slate-800 dark:text-slate-200 block truncate">
                            {ex.name || "Egzersiz"}
                          </span>
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            {ex.sets} set × {ex.reps} tekrar
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="shrink-0 flex flex-col gap-2 border-t border-slate-200 px-4 py-3 dark:border-slate-700 sm:flex-row sm:justify-end">
              <Button
                variant="secondary"
                onClick={() => !reorderLoading && closeReorderModal()}
                disabled={reorderLoading}
                className="w-full sm:w-auto"
              >
                İptal
              </Button>
              <Button
                onClick={saveReorder}
                disabled={reorderLoading}
                className="w-full sm:w-auto"
              >
                {reorderLoading ? "Kaydediliyor..." : "Kaydet"}
              </Button>
            </div>
          </div>
        </div>
      )}

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
          <Card 
            key={dayIndex} 
            variant="glass" 
            hoverable
            className="animate-slide-in-up"
            style={{ animationDelay: `${200 + dayIndex * 50}ms` }}
          >
            <CardHeader>
              <h3 className="font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-400">
                {day.dayName || `Gün ${dayIndex + 1}`}
              </h3>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {(day.exercises || []).map((ex, exIndex) => {
                  const displayName = ex.name || "Egzersiz";
                  const movementMatch = movements.find((m) => {
                    if (!m?.name) return false;
                    return (
                      m.name.trim().toLowerCase() ===
                      (ex.name || "").trim().toLowerCase()
                    );
                  });
                  const rawVideoUrl =
                    ex.videoUrl || movementMatch?.videoUrl || "";
                  const videoUrl = rawVideoUrl ? getEmbedUrl(rawVideoUrl) : "";

                  return (
                    <li
                      key={exIndex}
                      className="group flex flex-col gap-3 rounded-xl border border-slate-200/60 bg-white/80 backdrop-blur-sm px-4 py-3 shadow-sm transition-all duration-200 hover:border-blue-300 hover:shadow-md hover:-translate-y-0.5 dark:border-slate-600/60 dark:bg-slate-800/80 dark:hover:border-blue-600 sm:flex-row sm:flex-wrap sm:items-start"
                    >
                      <div className="flex flex-1 flex-col gap-1.5">
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {displayName}
                        </span>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                            </svg>
                            <span className="font-medium">{ex.sets} set</span>
                          </span>
                          <span className="flex items-center gap-1 text-cyan-600 dark:text-cyan-400">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                            <span className="font-medium">{ex.reps != null ? String(ex.reps) : "—"} tekrar</span>
                          </span>
                        </div>
                      </div>
                      {videoUrl && (
                        <div className="w-full sm:w-64 md:w-72">
                          <div className="relative aspect-video overflow-hidden rounded-lg border border-blue-200/50 bg-black/70 shadow-lg group-hover:shadow-xl group-hover:border-blue-300 transition-all dark:border-blue-800/50">
                            <iframe
                              src={videoUrl}
                              title={displayName || "Egzersiz videosu"}
                              className="h-full w-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                            />
                          </div>
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
