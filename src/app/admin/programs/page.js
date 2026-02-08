import AdminProgramsClient from "./AdminProgramsClient";

export default function AdminProgramsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
        Programlar
      </h1>
      <AdminProgramsClient />
    </div>
  );
}
