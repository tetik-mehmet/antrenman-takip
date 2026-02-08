import AdminSettingsClient from "./AdminSettingsClient";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-slate-800 dark:text-slate-200 sm:text-2xl">
        Ayarlar
      </h1>
      <AdminSettingsClient />
    </div>
  );
}
