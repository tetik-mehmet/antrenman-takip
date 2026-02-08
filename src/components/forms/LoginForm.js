"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";
import { validateEmail } from "@/lib/validation";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setEmailError("");

    if (!validateEmail(email)) {
      setEmailError("E-posta formatı hatalı.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Giriş başarısız.");
        setLoading(false);
        return;
      }
      const target = data.user?.role === "ADMIN" ? "/admin" : "/user";
      router.push(target);
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
        label="E-posta"
        id="email"
        type="email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (emailError) setEmailError("");
        }}
        placeholder="ornek@email.com"
        required
        autoComplete="email"
        error={emailError || (error ? " " : undefined)}
        labelClassName="text-zinc-300"
        className="border-zinc-600 bg-zinc-800/80 text-white placeholder:text-zinc-500 focus:border-[#FFD41D] focus:ring-2 focus:ring-[#FFD41D]/40 focus:ring-offset-0 focus:ring-offset-zinc-900"
      />
      <Input
        label="Şifre"
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="current-password"
        error={error ? " " : undefined}
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
        {loading ? "Giriş yapılıyor..." : "Giriş yap"}
      </Button>
      <p className="text-center text-sm text-zinc-400">
        Hesabınız yok mu?{" "}
        <Link
          href="/register"
          className="font-medium underline underline-offset-2 decoration-[#FFA240]/60 hover:decoration-[#FFD41D]"
          style={{ color: "#FFA240" }}
        >
          Kayıt olun
        </Link>
      </p>
    </form>
  );
}
