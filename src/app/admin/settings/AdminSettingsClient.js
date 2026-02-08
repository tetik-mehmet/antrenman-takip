"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Alert from "@/components/ui/Alert";

export default function AdminSettingsClient() {
  const [addAdminEmail, setAddAdminEmail] = useState("");
  const [addAdminPassword, setAddAdminPassword] = useState("");
  const [addAdminName, setAddAdminName] = useState("");
  const [addAdminError, setAddAdminError] = useState("");
  const [addAdminSuccess, setAddAdminSuccess] = useState("");
  const [addAdminLoading, setAddAdminLoading] = useState(false);

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

  return (
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
          <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
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
  );
}
