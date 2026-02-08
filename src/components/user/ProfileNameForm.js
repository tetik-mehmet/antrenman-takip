"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ProfileNameForm({ initialName, hideLabel = false }) {
  const router = useRouter();
  const [name, setName] = useState(initialName || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(initialName || "");
  }, [initialName]);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
        credentials: "same-origin",
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message || "Güncelleme başarısız.");
        setLoading(false);
        return;
      }
      toast.success("Profil güncellendi", {
        description: "Görünen adınız kaydedildi.",
      });
      router.refresh();
      setLoading(false);
    } catch {
      toast.error("Bağlantı hatası.");
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4"
    >
      <div className="min-w-0 flex-1">
        <Input
          label={hideLabel ? undefined : "İsim"}
          id="profile-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Adınızı girin"
          autoComplete="name"
          className="w-full"
          aria-label={hideLabel ? "Görünen ad" : undefined}
        />
      </div>
      <Button type="submit" disabled={loading} className="shrink-0">
        {loading ? "Kaydediliyor..." : "Kaydet"}
      </Button>
    </form>
  );
}
