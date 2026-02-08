"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";
import ProfileNameForm from "@/components/user/ProfileNameForm";

export default function AdminSettingsClient({
  initialName = "",
  initialEmail = "",
}) {
  const router = useRouter();
  const [addAdminEmail, setAddAdminEmail] = useState("");
  const [addAdminPassword, setAddAdminPassword] = useState("");
  const [addAdminName, setAddAdminName] = useState("");
  const [addAdminError, setAddAdminError] = useState("");
  const [addAdminSuccess, setAddAdminSuccess] = useState("");
  const [addAdminLoading, setAddAdminLoading] = useState(false);

  const [changeEmail, setChangeEmail] = useState(initialEmail);
  const [changeEmailPassword, setChangeEmailPassword] = useState("");
  const [changeEmailError, setChangeEmailError] = useState("");
  const [changeEmailSuccess, setChangeEmailSuccess] = useState("");
  const [changeEmailLoading, setChangeEmailLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [changePassError, setChangePassError] = useState("");
  const [changePassSuccess, setChangePassSuccess] = useState("");
  const [changePassLoading, setChangePassLoading] = useState(false);

  async function handleAddAdmin(e) {
    e.preventDefault();
    setAddAdminError("");
    setAddAdminSuccess("");
    if (addAdminPassword.length < 6) {
      setAddAdminError("Şifre en az 6 karakter olmalıdır.");
      return;
    }
    setAddAdminLoading(true);
    try {
      const res = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: addAdminEmail.trim(),
          password: addAdminPassword,
          name: addAdminName.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAddAdminError(data.message || "Hoca eklenemedi.");
        setAddAdminLoading(false);
        return;
      }
      setAddAdminSuccess("Hoca başarıyla eklendi.");
      setAddAdminEmail("");
      setAddAdminPassword("");
      setAddAdminName("");
      setAddAdminLoading(false);
    } catch {
      setAddAdminError("Bağlantı hatası.");
      setAddAdminLoading(false);
    }
  }

  async function handleChangeEmail(e) {
    e.preventDefault();
    setChangeEmailError("");
    setChangeEmailSuccess("");
    const trimmed = changeEmail.trim();
    if (!trimmed) {
      setChangeEmailError("Geçerli bir e-posta adresi girin.");
      return;
    }
    if (!changeEmailPassword) {
      setChangeEmailError("Güvenlik için mevcut şifrenizi girin.");
      return;
    }
    setChangeEmailLoading(true);
    try {
      const res = await fetch("/api/admin/change-email", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newEmail: trimmed,
          currentPassword: changeEmailPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setChangeEmailError(data.message || "E-posta güncellenemedi.");
        setChangeEmailLoading(false);
        return;
      }
      toast.success("E-posta güncellendi", {
        description: "Hesap e-posta adresiniz kaydedildi.",
      });
      setChangeEmailSuccess(data.message);
      setChangeEmail(trimmed);
      setChangeEmailPassword("");
      router.refresh();
      setChangeEmailLoading(false);
    } catch {
      setChangeEmailError("Bağlantı hatası.");
      setChangeEmailLoading(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setChangePassError("");
    setChangePassSuccess("");
    if (newPassword.length < 6) {
      setChangePassError("Yeni şifre en az 6 karakter olmalıdır.");
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      setChangePassError("Yeni şifre ve tekrar alanları eşleşmiyor.");
      return;
    }
    setChangePassLoading(true);
    try {
      const res = await fetch("/api/admin/change-password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setChangePassError(data.message || "Şifre güncellenemedi.");
        setChangePassLoading(false);
        return;
      }
      setChangePassSuccess("Şifreniz başarıyla güncellendi.");
      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordConfirm("");
      setChangePassLoading(false);
    } catch {
      setChangePassError("Bağlantı hatası.");
      setChangePassLoading(false);
    }
  }

  const displayInitial = (initialName?.trim() || "?").charAt(0).toUpperCase();

  return (
    <div className="flex flex-col gap-6">
      {/* Profil / İsim Güncelleme */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-700/80 dark:bg-slate-800/50 sm:rounded-xl">
        <div className="relative bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 px-4 py-5 dark:from-slate-800/90 dark:via-slate-800 dark:to-indigo-950/30 sm:px-6 sm:py-6">
          <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-indigo-500/10 dark:bg-indigo-500/5" />
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 text-xl font-bold text-white shadow-lg shadow-indigo-500/20 ring-2 ring-white dark:ring-slate-700 sm:h-16 sm:w-16 sm:rounded-2xl sm:text-2xl"
              aria-hidden
            >
              {displayInitial}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Profil
              </p>
              <h2 className="mt-1 text-lg font-semibold text-slate-800 dark:text-slate-100 sm:text-xl">
                Görünen adınızı güncelleyin
              </h2>
              <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                Dashboard ve menüde görünecek adınızı buradan
                değiştirebilirsiniz.
              </p>
            </div>
          </div>
        </div>
        <div className="space-y-5 border-t border-slate-200/80 px-4 py-4 dark:border-slate-700/80 sm:px-6 sm:py-5">
          <div>
            <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
              Görünen ad
            </p>
            <ProfileNameForm initialName={initialName} hideLabel />
          </div>
          <div className="border-t border-slate-200/60 pt-5 dark:border-slate-700/60">
            <p className="mb-3 text-sm font-medium text-slate-700 dark:text-slate-300">
              E-posta adresi
            </p>
            <form
              onSubmit={handleChangeEmail}
              className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4"
            >
              <div className="min-w-0 flex-1 space-y-3">
                <Input
                  label="Yeni e-posta"
                  id="change-email"
                  type="email"
                  value={changeEmail}
                  onChange={(e) => setChangeEmail(e.target.value)}
                  placeholder="ornek@domain.com"
                  required
                  autoComplete="email"
                />
                <Input
                  label="Mevcut şifre (güvenlik için)"
                  id="change-email-password"
                  type="password"
                  value={changeEmailPassword}
                  onChange={(e) => setChangeEmailPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
              </div>
              <Button
                type="submit"
                disabled={changeEmailLoading}
                className="shrink-0"
              >
                {changeEmailLoading ? "Güncelleniyor..." : "E-postayı Güncelle"}
              </Button>
            </form>
            {changeEmailError && (
              <Alert variant="error" className="mt-3">
                {changeEmailError}
              </Alert>
            )}
            {changeEmailSuccess && (
              <Alert variant="success" className="mt-3">
                {changeEmailSuccess}
              </Alert>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Yeni Hoca Ekleme */}
        <Card className="flex-1">
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              Yeni Hoca Ekle
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Sisteme yeni hoca hesabı ekleyin.
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddAdmin} className="flex flex-col gap-4">
              {addAdminError && <Alert variant="error">{addAdminError}</Alert>}
              {addAdminSuccess && (
                <Alert variant="success">{addAdminSuccess}</Alert>
              )}
              <Input
                label="E-posta"
                id="add-admin-email"
                type="email"
                value={addAdminEmail}
                onChange={(e) => setAddAdminEmail(e.target.value)}
                placeholder="hoca@ornek.com"
                required
                autoComplete="email"
              />
              <Input
                label="Şifre (en az 6 karakter)"
                id="add-admin-password"
                type="password"
                value={addAdminPassword}
                onChange={(e) => setAddAdminPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
              />
              <Input
                label="İsim (isteğe bağlı)"
                id="add-admin-name"
                type="text"
                value={addAdminName}
                onChange={(e) => setAddAdminName(e.target.value)}
                placeholder="Hoca adı"
                autoComplete="name"
              />
              <Button type="submit" disabled={addAdminLoading}>
                {addAdminLoading ? "Ekleniyor..." : "Hoca Ekle"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Şifre Değiştirme */}
        <Card className="flex-1">
          <CardHeader>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              Şifre Değiştir
            </h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Kendi hesap şifrenizi güncelleyin.
            </p>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleChangePassword}
              className="flex flex-col gap-4"
            >
              {changePassError && (
                <Alert variant="error">{changePassError}</Alert>
              )}
              {changePassSuccess && (
                <Alert variant="success">{changePassSuccess}</Alert>
              )}
              <Input
                label="Mevcut şifre"
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
              <Input
                label="Yeni şifre (en az 6 karakter)"
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
              />
              <Input
                label="Yeni şifre (tekrar)"
                id="new-password-confirm"
                type="password"
                value={newPasswordConfirm}
                onChange={(e) => setNewPasswordConfirm(e.target.value)}
                required
                minLength={6}
                autoComplete="new-password"
              />
              <Button type="submit" disabled={changePassLoading}>
                {changePassLoading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
