"use client";

import { useState } from "react";
import { toast } from "sonner";
import Button from "@/components/ui/Button";

export default function ProgramRequestForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!notes.trim()) {
      toast.error("Lütfen isteklerinizi, sakatlıklarınızı vb. yazın.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/program-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes: notes.trim() }),
        credentials: "same-origin",
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Talep gönderilemedi.");
        setLoading(false);
        return;
      }
      toast.success("Talep gönderildi", {
        description: "PT hocalarımız talebinizi inceleyecektir.",
      });
      setNotes("");
      setIsOpen(false);
    } catch {
      toast.error("Bağlantı hatası.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 p-4 dark:border-emerald-800 dark:bg-emerald-950/30 sm:p-4">
      {!isOpen ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
            Kendiniz antrenman programı oluşturabilir ve PT hocalarımızdan
            antrenman programı talep edebilirsiniz!
          </p>
          <Button
            type="button"
            onClick={() => setIsOpen(true)}
            className="shrink-0 bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            Program Talep Et
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="program-request-notes"
              className="mb-1.5 block text-sm font-medium text-emerald-800 dark:text-emerald-200"
            >
              İstekleriniz, sakatlıklarınız vb.
            </label>
            <textarea
              id="program-request-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Örn: Diz sakatlığım var, kardiyo ağırlıklı program istiyorum..."
              rows={4}
              className="w-full resize-y rounded-lg border border-emerald-200 bg-white px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:border-emerald-700 dark:bg-slate-800 dark:text-slate-200 dark:placeholder-slate-500 dark:focus:border-emerald-500 dark:focus:ring-emerald-900/50"
              disabled={loading}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? "Gönderiliyor..." : "Gönder"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsOpen(false);
                setNotes("");
              }}
              disabled={loading}
            >
              İptal
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
