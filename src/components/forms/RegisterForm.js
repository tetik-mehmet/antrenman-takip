"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("İsim soyisim alanı zorunludur.");
      return;
    }
    if (password.length < 6) {
      setError("Şifre en az 6 karakter olmalıdır.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name: name.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Kayıt başarısız.");
        setLoading(false);
        return;
      }
      router.push("/user");
      router.refresh();
    } catch {
      setError("Bağlantı hatası.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-5">
      {error && (
        <Alert
          variant="error"
          className="border-[#FF4646] bg-[#D73535]/20 text-[#FF4646]"
        >
          {error}
        </Alert>
      )}
      <Input
        label="İsim Soyisim"
        id="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Adınız Soyadınız"
        required
        autoComplete="name"
        labelClassName="text-zinc-300"
        className="border-zinc-600 bg-zinc-800/80 text-white placeholder:text-zinc-500 focus:border-[#FFD41D] focus:ring-2 focus:ring-[#FFD41D]/40 focus:ring-offset-0 focus:ring-offset-zinc-900"
      />
      <Input
        label="E-posta"
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="ornek@email.com"
        required
        autoComplete="email"
        labelClassName="text-zinc-300"
        className="border-zinc-600 bg-zinc-800/80 text-white placeholder:text-zinc-500 focus:border-[#FFD41D] focus:ring-2 focus:ring-[#FFD41D]/40 focus:ring-offset-0 focus:ring-offset-zinc-900"
      />
      <Input
        label="Şifre (en az 6 karakter)"
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        minLength={6}
        autoComplete="new-password"
        showPassword={showPassword}
        onToggleShowPassword={() => setShowPassword((p) => !p)}
        labelClassName="text-zinc-300"
        className="border-zinc-600 bg-zinc-800/80 text-white placeholder:text-zinc-500 focus:border-[#FFD41D] focus:ring-2 focus:ring-[#FFD41D]/40 focus:ring-offset-0 focus:ring-offset-zinc-900"
      />
      <Button
        type="submit"
        disabled={loading}
        className="w-full font-semibold text-zinc-900 hover:bg-[#FFA240] focus:ring-[#FFA240]"
        style={{ backgroundColor: "#FFD41D" }}
      >
        {loading ? "Kayıt yapılıyor..." : "Kayıt ol"}
      </Button>
      <p className="text-center text-sm text-zinc-400">
        Zaten hesabınız var mı?{" "}
        <Link
          href="/login"
          className="font-medium underline underline-offset-2 decoration-[#FFA240]/60 hover:decoration-[#FFD41D]"
          style={{ color: "#FFA240" }}
        >
          Giriş yapın
        </Link>
      </p>
    </form>
  );
}
