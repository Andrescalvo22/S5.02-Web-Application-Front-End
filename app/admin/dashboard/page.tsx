import { AdminDashboard } from "@/components/admin-dashboard";

export default function AdminDashboardPage() {
  return (
    <main
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/workshop.bg.jpg')" }}
    >
      <div className="min-h-screen bg-black/70 text-white flex flex-col items-center py-24">
        <AdminDashboard />
      </div>
    </main>
  );
}
