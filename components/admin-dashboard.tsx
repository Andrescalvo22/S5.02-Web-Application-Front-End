"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Users, Car, Wrench, AlertCircle } from "lucide-react";

import { AdminLayout } from "@/components/admin-layout";
import { getAllCustomers } from "@/api/customer";
import { getAllCars } from "@/api/cars";
import { getAllOrders } from "@/api/repairs";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-600 text-black",
  IN_PROGRESS: "bg-blue-600 text-white",
  READY_FOR_PICKUP: "bg-green-500 text-black",
  CLOSED: "bg-gray-700 text-white",
};

export function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [clients, setClients] = useState<any[]>([]);
  const [cars, setCars] = useState<any[]>([]);
  const [repairs, setRepairs] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const [usersData, carsData, repairsData] = await Promise.all([
          getAllCustomers(),
          getAllCars(),
          getAllOrders(),
        ]);

        const onlyUsers = usersData.filter((u: any) =>
          u.roles?.includes("ROLE_USER")
        );

        setClients(onlyUsers);
        setCars(carsData);
        setRepairs(repairsData);
      } catch (e) {
        console.error(e);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const stats = useMemo(() => {
    const totalClients = clients.length;
    const totalCars = cars.length;

    const activeRepairs = repairs.filter((r) => r.status !== "CLOSED").length;

    const urgentCases = repairs.filter((r) => r.status === "PENDING");

    return {
      totalClients,
      totalCars,
      activeRepairs,
      urgentCases,
    };
  }, [clients, cars, repairs]);

  const urgentList = useMemo(() => {
    return repairs.filter((r) => r.status === "PENDING").slice(0, 5);
  }, [repairs]);

  return (
    <AdminLayout>
      <div className="w-full max-w-6xl">
        <div className="rounded-3xl bg-black/70 p-12 shadow-2xl">
          <header className="flex items-center justify-between mb-14 border-b border-red-700 pb-8">
            <div className="flex items-center gap-5">
              <Wrench className="w-12 h-12 text-red-500" />
              <h1 className="text-6xl font-bold text-red-500">
                Admin Dashboard
              </h1>
            </div>

            <Link
              href="/admin/clients"
              className="px-8 py-5 bg-white text-black hover:bg-gray-200 rounded-2xl font-bold text-2xl"
            >
              Manage Clients
            </Link>
          </header>

          {loading ? (
            <p className="text-3xl font-semibold text-center py-20">
              Loading dashboard...
            </p>
          ) : error ? (
            <p className="text-3xl font-semibold text-center py-20 text-red-300">
              {error}
            </p>
          ) : (
            <div className="flex flex-col gap-16">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-10">
                <div className="bg-red-600 border border-red-400 shadow-2xl rounded-3xl p-10">
                  <div className="flex justify-between items-center mb-6">
                    <p className="text-3xl font-bold">Total Clients</p>
                    <Users className="w-10 h-10" />
                  </div>
                  <p className="text-6xl font-bold text-black">
                    {stats.totalClients}
                  </p>
                </div>

                <div className="bg-red-600 border border-red-400 shadow-2xl rounded-3xl p-10">
                  <div className="flex justify-between items-center mb-6">
                    <p className="text-3xl font-bold">Registered Cars</p>
                    <Car className="w-10 h-10" />
                  </div>
                  <p className="text-6xl font-bold text-black">
                    {stats.totalCars}
                  </p>
                </div>

                <div className="bg-red-600 border border-red-400 shadow-2xl rounded-3xl p-10">
                  <div className="flex justify-between items-center mb-6">
                    <p className="text-3xl font-bold">Active Repairs</p>
                    <Wrench className="w-10 h-10" />
                  </div>
                  <p className="text-6xl font-bold text-black">
                    {stats.activeRepairs}
                  </p>
                </div>

                <div className="bg-red-600 border border-red-400 shadow-2xl rounded-3xl p-10">
                  <div className="flex justify-between items-center mb-6">
                    <p className="text-3xl font-bold">Urgent Cases</p>
                    <AlertCircle className="w-10 h-10" />
                  </div>
                  <p className="text-6xl font-bold text-black">
                    {stats.urgentCases.length}
                  </p>
                </div>
              </div>

              <section className="bg-red-600 border border-red-400 shadow-2xl rounded-3xl p-12">
                <h2 className="text-5xl font-bold flex items-center gap-5 mb-10">
                  <AlertCircle className="w-11 h-11" />
                  Urgent Repair Cases
                </h2>

                {urgentList.length === 0 ? (
                  <p className="text-black text-3xl font-semibold text-center py-12">
                    No urgent cases 🎉
                  </p>
                ) : (
                  <div className="flex flex-col gap-6">
                    {urgentList.map((r) => (
                      <Link
                        key={r.id}
                        href={`/admin/repairs/${r.id}`}
                        className="block p-8 bg-black/30 rounded-2xl border border-white hover:bg-black/40 transition"
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-3xl font-bold">Repair</p>
                            <p className="text-2xl opacity-90 mt-2">
                              {r.car?.brand} {r.car?.model} ({r.car?.plateNumber})
                            </p>
                          </div>

                          <span
                            className={`px-6 py-4 rounded-2xl text-2xl font-bold ${
                              statusColors[r.status] ?? "bg-gray-700 text-white"
                            }`}
                          >
                            {(r.status ?? "").replaceAll("_", " ")}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}


