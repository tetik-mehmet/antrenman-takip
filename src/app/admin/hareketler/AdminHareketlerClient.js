"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";

export default function AdminHareketlerClient() {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", videoUrl: "" });
  const [filter, setFilter] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  function resetForm() {
    setForm({ name: "", videoUrl: "" });
    setEditingId(null);
    setFormError("");
  }

  async function loadMovements() {
    setLoading(true);
    setError("");
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
      setError(err.message || "Hareketler yüklenemedi.");
      setMovements([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMovements();
  }, []);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    const name = form.name.trim();
    const videoUrl = form.videoUrl.trim();

    if (!name || !videoUrl) {
      setFormError("Hareket adı ve video URL zorunludur.");
      return;
    }

    setSaving(true);
    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `/api/movements/${editingId}` : "/api/movements";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, videoUrl }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "Kayıt sırasında hata oluştu.");
      }

      setFormSuccess(
        editingId ? "Hareket güncellendi." : "Hareket başarıyla eklendi."
      );
      resetForm();
      await loadMovements();
    } catch (err) {
      setFormError(err.message || "Kayıt sırasında hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  async function handleEdit(movement) {
    setEditingId(movement._id);
    setForm({
      name: movement.name || "",
      videoUrl: movement.videoUrl || "",
    });
    setFormError("");
    setFormSuccess("");
  }

  async function handleDelete(id) {
    if (!window.confirm("Bu hareketi silmek istediğinize emin misiniz?")) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch(`/api/movements/${id}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "Hareket silinemedi.");
      }
      await loadMovements();
    } catch (err) {
      alert(err.message || "Hareket silinemedi.");
    } finally {
      setDeletingId(null);
    }
  }

  const filteredMovements = movements.filter((m) => {
    if (!filter.trim()) return true;
    const q = filter.trim().toLowerCase();
    return (
      (m.name || "").toLowerCase().includes(q) ||
      (m.videoUrl || "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
          Hareketler
        </h1>
        <div className="w-full max-w-sm">
          <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
            Ara
          </label>
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="İsim veya URL ile ara..."
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>
      </div>

      <Card className="border-emerald-200 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-950/30">
        <CardHeader>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            Yeni hareket ekle
          </h2>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && <Alert variant="error">{formError}</Alert>}
            {formSuccess && <Alert variant="success">{formSuccess}</Alert>}
            <div className="grid gap-3 md:grid-cols-2">
              <Input
                label="Hareket adı"
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Örn: Barbell Squat"
                required
              />
              <Input
                label="Video URL"
                value={form.videoUrl}
                onChange={(e) => handleChange("videoUrl", e.target.value)}
                placeholder="Örn: https://youtube.com/..."
                required
              />
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-sm text-slate-600 underline hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                >
                  Düzenlemeyi iptal et
                </button>
              )}
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                <Button
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto"
                >
                  {saving
                    ? "Kaydediliyor..."
                    : editingId
                    ? "Hareketi güncelle"
                    : "Hareket ekle"}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>

      {error && <Alert variant="error">{error}</Alert>}

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            Kayıtlı hareketler
          </h2>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="py-6 text-center text-slate-600 dark:text-slate-400">
              Yükleniyor...
            </p>
          ) : filteredMovements.length === 0 ? (
            <p className="py-6 text-center text-slate-600 dark:text-slate-400">
              Henüz kayıtlı hareket yok.
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredMovements.map((movement) => (
                <div
                  key={movement._id}
                  className="flex flex-col justify-between rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60"
                >
                  <div className="space-y-1">
                    <p className="font-semibold text-slate-800 dark:text-slate-100">
                      {movement.name}
                    </p>
                    <a
                      href={movement.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="break-all text-sm text-slate-600 underline hover:text-slate-800 dark:text-slate-300 dark:hover:text-slate-100"
                    >
                      Videoyu aç
                    </a>
                  </div>
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => handleEdit(movement)}
                      className="w-full sm:w-auto"
                    >
                      Düzenle
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      onClick={() => handleDelete(movement._id)}
                      disabled={deletingId === movement._id}
                      className="w-full sm:w-auto"
                    >
                      {deletingId === movement._id ? "Siliniyor..." : "Sil"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
