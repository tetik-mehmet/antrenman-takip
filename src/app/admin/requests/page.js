import AdminRequestsClient from "./AdminRequestsClient";

export default function AdminRequestsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
        Talepler
      </h1>
      <p className="text-sm text-slate-500 dark:text-slate-400">
        Kullanıcıların PT program talepleri, istekleri ve sakatlık notları.
      </p>
      <AdminRequestsClient />
    </div>
  );
}
