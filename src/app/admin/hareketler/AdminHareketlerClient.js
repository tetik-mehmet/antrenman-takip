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
  const [form, setForm] = useState({ name: "", videoUrl: "" });
  const [filter, setFilter] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingMovement, setEditingMovement] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", videoUrl: "" });
  const [editFormError, setEditFormError] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  function resetForm() {
    setForm({ name: "", videoUrl: "" });
    setFormError("");
  }

  function closeEditModal() {
    setEditModalOpen(false);
    setEditingMovement(null);
    setEditForm({ name: "", videoUrl: "" });
    setEditFormError("");
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
      const res = await fetch("/api/movements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, videoUrl }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "Kayıt sırasında hata oluştu.");
      }

      setFormSuccess("Hareket başarıyla eklendi.");
      resetForm();
      await loadMovements();
    } catch (err) {
      setFormError(err.message || "Kayıt sırasında hata oluştu.");
    } finally {
      setSaving(false);
    }
  }

  function handleEditClick(movement) {
    setEditingMovement(movement);
    setEditForm({
      name: movement.name || "",
      videoUrl: movement.videoUrl || "",
    });
    setEditFormError("");
    setEditModalOpen(true);
  }

  function handleEditFormChange(field, value) {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
    if (!editingMovement) return;
    setEditFormError("");

    const name = editForm.name.trim();
    const videoUrl = editForm.videoUrl.trim();

    if (!name || !videoUrl) {
      setEditFormError("Hareket adı ve video URL zorunludur.");
      return;
    }

    setEditSaving(true);
    try {
      const res = await fetch(`/api/movements/${editingMovement._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, videoUrl }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.message || "Güncelleme sırasında hata oluştu.");
      }
      closeEditModal();
      await loadMovements();
    } catch (err) {
      setEditFormError(err.message || "Güncelleme sırasında hata oluştu.");
    } finally {
      setEditSaving(false);
    }
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
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              <Button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto"
              >
                {saving ? "Kaydediliyor..." : "Hareket ekle"}
              </Button>
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
                      onClick={() => handleEditClick(movement)}
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

      {editModalOpen && editingMovement && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-movement-modal-title"
        >
          <div
            className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/70"
            onClick={() => !editSaving && closeEditModal()}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800">
            <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
              <h2
                id="edit-movement-modal-title"
                className="text-lg font-semibold text-slate-800 dark:text-slate-200"
              >
                Hareketi düzenle
              </h2>
            </div>
            <form onSubmit={handleEditSubmit} className="p-4 space-y-4">
              {editFormError && (
                <Alert variant="error">{editFormError}</Alert>
              )}
              <Input
                label="Hareket adı"
                value={editForm.name}
                onChange={(e) => handleEditFormChange("name", e.target.value)}
                placeholder="Örn: Barbell Squat"
                required
              />
              <Input
                label="Video URL"
                value={editForm.videoUrl}
                onChange={(e) =>
                  handleEditFormChange("videoUrl", e.target.value)
                }
                placeholder="Örn: https://youtube.com/..."
                required
              />
              <div className="flex flex-col gap-2 border-t border-slate-200 pt-4 dark:border-slate-700 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={closeEditModal}
                  disabled={editSaving}
                  className="w-full sm:w-auto"
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  disabled={editSaving}
                  className="w-full sm:w-auto"
                >
                  {editSaving ? "Kaydediliyor..." : "Güncelle"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
