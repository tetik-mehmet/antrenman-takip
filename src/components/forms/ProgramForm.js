"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

const emptyDay = () => ({
  dayName: "",
  exercises: [{ name: "", sets: 3, reps: 12 }],
});
const emptyExercise = () => ({ name: "", sets: 3, reps: 12 });

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

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!title.trim()) {
      setError("Program başlığı girin.");
      return;
    }
    const payload = {
      title: title.trim(),
      days: days.map((day) => ({
        dayName: day.dayName || "Gün",
        exercises: (day.exercises || []).map((e) => ({
          name: e.name || "Egzersiz",
          sets: Number(e.sets) || 1,
          reps: Number(e.reps) || 1,
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
          <Card key={dayIndex}>
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <Input
                placeholder="Gün adı (örn: Pazartesi)"
                value={day.dayName}
                onChange={(e) => setDayName(dayIndex, e.target.value)}
                className="w-full flex-1"
              />
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
                  <Input
                    placeholder="Egzersiz adı"
                    value={ex.name}
                    onChange={(e) =>
                      setExercise(dayIndex, exIndex, "name", e.target.value)
                    }
                    className="min-w-0 flex-1 sm:min-w-[140px]"
                  />
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
                      placeholder="Tekrar"
                      type="number"
                      min={1}
                      value={ex.reps}
                      onChange={(e) =>
                        setExercise(dayIndex, exIndex, "reps", e.target.value)
                      }
                      className="w-full sm:w-20"
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
    </form>
  );
}
