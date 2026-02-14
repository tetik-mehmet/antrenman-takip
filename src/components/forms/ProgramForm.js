"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

const emptyDay = () => ({
  dayName: "",
  exercises: [{ name: "", sets: 3, reps: "12" }],
});
const emptyExercise = () => ({ name: "", sets: 3, reps: "12" });

function normalizeReps(value) {
  if (value == null) return "1";
  const s = String(value).trim();
  if (!s) return "1";
  return s;
}

function isValidReps(value) {
  if (!value) return false;
  const s = String(value).trim();
  return /^\d+$/.test(s) || /^\d+\s*-\s*\d+$/.test(s);
}

export default function ProgramForm({
  initialTitle = "",
  initialDays = [emptyDay()],
  targetUserId = null,
  targetUserOptions = [],
  onSubmit,
  submitLabel = "Kaydet",
}) {
  const [title, setTitle] = useState(initialTitle);
  const [days, setDays] = useState(() =>
    initialDays.length ? initialDays : [emptyDay()]
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(targetUserId || "");
  const [movements, setMovements] = useState([]);
  const [movementsLoading, setMovementsLoading] = useState(false);
  const [movementError, setMovementError] = useState("");
  const [movementSearch, setMovementSearch] = useState("");
  const [movementPicker, setMovementPicker] = useState({
    open: false,
    dayIndex: null,
    exIndex: null,
  });

  function addDay() {
    setDays((d) => [...d, emptyDay()]);
  }

  function removeDay(index) {
    setDays((d) => d.filter((_, i) => i !== index));
  }

  function setDayName(index, value) {
    setDays((d) => {
      const next = [...d];
      next[index] = { ...next[index], dayName: value };
      return next;
    });
  }

  function addExercise(dayIndex) {
    setDays((d) => {
      const next = d.map((day, i) =>
        i === dayIndex
          ? { ...day, exercises: [...day.exercises, emptyExercise()] }
          : day
      );
      return next;
    });
  }

  function removeExercise(dayIndex, exIndex) {
    setDays((d) => {
      const next = d.map((day, i) =>
        i === dayIndex
          ? {
              ...day,
              exercises: day.exercises.filter((_, j) => j !== exIndex),
            }
          : day
      );
      return next;
    });
  }

  function setExercise(dayIndex, exIndex, field, value) {
    setDays((d) => {
      const next = d.map((day, i) => {
        if (i !== dayIndex) return day;
        const exercises = day.exercises.map((ex, j) =>
          j === exIndex ? { ...ex, [field]: value } : ex
        );
        return { ...day, exercises };
      });
      return next;
    });
  }


  useEffect(() => {
    async function loadMovements() {
      setMovementsLoading(true);
      setMovementError("");
      try {
        const res = await fetch("/api/movements");
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Hareketler yüklenemedi.");
        }
        const data = await res.json();
        setMovements(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Movements load error:", err);
        setMovementError(err.message || "Hareketler yüklenemedi.");
      } finally {
        setMovementsLoading(false);
      }
    }

    // Sadece admin tarafında kullanılıyor olsa bile,
    // component genel bir form olduğu için korumalı hata yönetimi ile çağırıyoruz.
    loadMovements();
  }, []);

  function openMovementPicker(dayIndex, exIndex) {
    setMovementPicker({ open: true, dayIndex, exIndex });
    setMovementSearch("");
  }

  function closeMovementPicker() {
    setMovementPicker({ open: false, dayIndex: null, exIndex: null });
    setMovementSearch("");
  }

  function applyMovementToExercise(movement) {
    if (
      movementPicker.dayIndex == null ||
      movementPicker.exIndex == null ||
      !movement
    ) {
      return;
    }
    setDays((d) => {
      return d.map((day, i) => {
        if (i !== movementPicker.dayIndex) return day;
        const exercises = day.exercises.map((ex, j) => {
          if (j !== movementPicker.exIndex) return ex;
          return {
            ...ex,
            name: movement.name || ex.name,
            movementId: movement._id,
            videoUrl: movement.videoUrl || ex.videoUrl,
          };
        });
        return { ...day, exercises };
      });
    });
    closeMovementPicker();
  }

  const filteredMovements = movements.filter((m) => {
    if (!movementSearch.trim()) return true;
    const q = movementSearch.trim().toLowerCase();
    return (
      (m.name || "").toLowerCase().includes(q) ||
      (m.videoUrl || "").toLowerCase().includes(q)
    );
  });

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!title.trim()) {
      setError("Program başlığı girin.");
      return;
    }
    for (const day of days) {
      for (const ex of day.exercises || []) {
        if (!isValidReps(ex.reps)) {
          setError(
            `Geçersiz tekrar formatı: "${ex.reps || ""}". Sabit (12) veya aralık (10-12) girin.`
          );
          return;
        }
      }
    }
    const payload = {
      title: title.trim(),
      days: days.map((day) => ({
        dayName: day.dayName || "Gün",
        exercises: (day.exercises || []).map((e) => ({
          name: e.name || "Egzersiz",
          sets: Number(e.sets) || 1,
          reps: normalizeReps(e.reps),
          movementId: e.movementId || undefined,
          videoUrl: e.videoUrl || undefined,
        })),
      })),
    };
    if (targetUserOptions.length && selectedUserId) {
      payload.targetUserId = selectedUserId;
    }
    setLoading(true);
    try {
      await onSubmit(payload);
    } catch (err) {
      setError(err.message || "Kayıt sırasında hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <Alert variant="error">{error}</Alert>}
      <Input
        label="Program başlığı"
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Örn: Haftalık Full Body"
        required
      />
      {targetUserOptions.length > 0 && (
        <div className="w-full">
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Kullanıcı ata
          </label>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="w-full min-h-[44px] rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            required
          >
            <option value="">Seçin</option>
            {targetUserOptions.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name || "İsimsiz"} ({u.role})
              </option>
            ))}
          </select>
        </div>
      )}
      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            Günler ve egzersizler
          </h3>
          <Button
            type="button"
            variant="secondary"
            onClick={addDay}
            className="w-full sm:w-auto"
          >
            Gün ekle
          </Button>
        </div>
        {days.map((day, dayIndex) => (
          <Card
            key={dayIndex}
          >
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex w-full items-center gap-2 sm:flex-1">
                <Input
                  placeholder="Gün adı (örn: Pazartesi)"
                  value={day.dayName}
                  onChange={(e) => setDayName(dayIndex, e.target.value)}
                  className="w-full flex-1"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                onClick={() => removeDay(dayIndex)}
                disabled={days.length <= 1}
                className="w-full shrink-0 sm:w-auto"
              >
                Günü sil
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {(day.exercises || []).map((ex, exIndex) => (
                <div
                  key={exIndex}
                  className="flex flex-col gap-2 rounded-lg border border-slate-200 p-3 dark:border-slate-600 sm:flex-row sm:flex-wrap sm:items-end"
                >
                  <div className="flex w-full flex-col gap-2 sm:flex-1">
                    <Input
                      placeholder="Egzersiz adı"
                      value={ex.name}
                      onChange={(e) =>
                        setExercise(dayIndex, exIndex, "name", e.target.value)
                      }
                      className="min-w-0 flex-1 sm:min-w-[140px]"
                    />
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => openMovementPicker(dayIndex, exIndex)}
                        className="w-full sm:w-auto"
                      >
                        Hareket seç
                      </Button>
                      {ex.videoUrl && (
                        <a
                          href={ex.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex min-h-[44px] items-center justify-center rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 underline hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-700"
                        >
                          Videoyu aç
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:flex sm:grid-cols-none">
                    <Input
                      placeholder="Set"
                      type="number"
                      min={1}
                      value={ex.sets}
                      onChange={(e) =>
                        setExercise(dayIndex, exIndex, "sets", e.target.value)
                      }
                      className="w-full sm:w-20"
                    />
                    <Input
                      placeholder="12 veya 10-12"
                      type="text"
                      value={ex.reps != null ? String(ex.reps) : ""}
                      onChange={(e) =>
                        setExercise(dayIndex, exIndex, "reps", e.target.value)
                      }
                      className="w-full sm:w-24"
                      aria-label="Tekrar sayısı: sabit (12) veya aralık (10-12)"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => removeExercise(dayIndex, exIndex)}
                    disabled={(day.exercises || []).length <= 1}
                    className="w-full sm:w-auto"
                  >
                    Sil
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="secondary"
                onClick={() => addExercise(dayIndex)}
                className="w-full sm:w-auto"
              >
                Egzersiz ekle
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? "Kaydediliyor..." : submitLabel}
      </Button>

      {movementPicker.open && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center p-4 animate-fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm dark:bg-slate-950/80"
            onClick={closeMovementPicker}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-lg rounded-2xl border border-white/20 bg-white/95 backdrop-blur-xl shadow-2xl animate-scale-in dark:border-slate-700/50 dark:bg-slate-800/95">
            <div className="flex items-center justify-between border-b border-slate-200/60 px-4 py-3 dark:border-slate-700/60">
              <h2 className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-cyan-400">
                Hareket seç
              </h2>
              <button
                type="button"
                onClick={closeMovementPicker}
                className="rounded-lg p-1.5 text-slate-500 transition-all hover:bg-blue-50 hover:text-blue-700 hover:scale-110 dark:text-slate-400 dark:hover:bg-blue-900/20 dark:hover:text-blue-400"
                aria-label="Kapat"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="max-h-[60vh] space-y-3 overflow-y-auto px-4 py-3">
              {movementError && <Alert variant="error">{movementError}</Alert>}
              <div className="space-y-2">
                <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Ara
                </label>
                <input
                  type="text"
                  value={movementSearch}
                  onChange={(e) => setMovementSearch(e.target.value)}
                  placeholder="İsim veya URL ile ara..."
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
              {movementsLoading ? (
                <p className="py-4 text-center text-sm text-slate-600 dark:text-slate-400">
                  Hareketler yükleniyor...
                </p>
              ) : filteredMovements.length === 0 ? (
                <p className="py-4 text-center text-sm text-slate-600 dark:text-slate-400">
                  Kayıtlı hareket bulunamadı.
                </p>
              ) : (
                <ul className="space-y-2">
                  {filteredMovements.map((m, index) => (
                    <li key={m._id} className="animate-slide-in-up" style={{ animationDelay: `${index * 30}ms` }}>
                      <button
                        type="button"
                        onClick={() => applyMovementToExercise(m)}
                        className="group flex w-full flex-col items-start gap-1 rounded-lg border border-slate-200/60 bg-white/80 backdrop-blur-sm px-3 py-2.5 text-left text-sm transition-all hover:border-blue-300 hover:bg-blue-50 hover:shadow-md hover:-translate-y-0.5 dark:border-slate-600/60 dark:bg-slate-800/80 dark:hover:border-blue-600 dark:hover:bg-slate-700"
                      >
                        <span className="font-medium text-slate-800 group-hover:text-blue-700 transition-colors dark:text-slate-100 dark:group-hover:text-blue-400">
                          {m.name}
                        </span>
                        <span className="break-all text-xs text-slate-600 dark:text-slate-400">
                          {m.videoUrl}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex justify-end gap-2 border-t border-slate-200 px-4 py-3 dark:border-slate-700">
              <Button
                type="button"
                variant="secondary"
                onClick={closeMovementPicker}
              >
                Kapat
              </Button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
