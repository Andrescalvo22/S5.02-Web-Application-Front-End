"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Car, Plus, Wrench, LogOut, Calendar } from "lucide-react";

import { getMyCars } from "@/api/cars";
import { getMyOrders } from "@/api/repairs";
import { logout } from "@/api/auth";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-600 text-black",
  IN_PROGRESS: "bg-blue-600 text-white",
  WAITING_FOR_PARTS: "bg-purple-600 text-white",
  FINISHED: "bg-green-600 text-black",
  READY_FOR_PICKUP: "bg-green-500 text-black",
};

export default function ClientDashboard() {
  const [cars, setCars] = useState<any[]>([]);
  const [repairs, setRepairs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [carsData, repairsData] = await Promise.all([
          getMyCars(),
          getMyOrders(),
        ]);

        setCars(carsData);
        setRepairs(repairsData);
      } catch (err) {
        console.error("Dashboard load error:", err);
        setCars([]);
        setRepairs([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <main
      className="min-h-screen text-white"
      style={{
        backgroundImage: "url('/workshop.bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="min-h-screen bg-black/70 flex flex-col items-center py-24">
        {/* HEADER */}
        <header className="w-full max-w-[1700px] flex justify-between items-center mb-20 border-b border-red-700 pb-10 px-10">
          <h1 className="text-6xl font-bold flex items-center gap-5 text-red-500">
            <Wrench className="h-14 w-14" />
            Client Dashboard
          </h1>

          <button
            onClick={logout}
            className="px-10 py-5 bg-red-600 hover:bg-red-800 rounded-2xl font-bold text-3xl flex items-center gap-4"
          >
            <LogOut className="w-9 h-9" />
            Logout
          </button>
        </header>

        {/* QUICK ACTIONS */}
        <div className="w-full max-w-[1700px] flex gap-10 mb-16 px-10">
          <Link
            href="/client/register-car"
            className="flex items-center justify-center gap-5 bg-red-600 hover:bg-red-700 
                     text-white font-bold px-10 py-6 rounded-3xl shadow-xl text-3xl w-[340px]"
          >
            <Plus className="w-9 h-9" />
            Register Car
          </Link>

          <Link
            href="/client/request-repair"
            className="flex items-center justify-center gap-5 bg-white text-black hover:bg-gray-200 
                     font-bold px-10 py-6 rounded-3xl shadow-xl text-3xl w-[340px]"
          >
            <Calendar className="w-9 h-9" />
            Request Repair
          </Link>
        </div>

        {/* DASHBOARD CONTENT */}
        <div className="flex flex-col gap-16 w-full max-w-[1700px] px-10">
          {/* MY CARS */}
          <div className="bg-red-600 border border-red-400 shadow-2xl text-white p-14 rounded-3xl">
            <h2 className="text-5xl font-bold flex items-center gap-5 mb-10">
              <Car className="w-11 h-11" />
              My Cars{cars.length > 0 ? ` (${cars.length})` : ""}
            </h2>

            {cars.length === 0 ? (
              <p className="text-black text-3xl font-semibold text-center py-12">
                No cars registered yet
              </p>
            ) : (
              cars.map((car) => (
                <div
                  key={car.id}
                  className="p-8 bg-black/30 rounded-2xl border border-white mb-6 hover:bg-black/40 transition text-3xl"
                >
                  <p className="font-bold">
                    {car.brand} {car.model}
                  </p>
                  <p className="opacity-80">
                    {car.year} • {car.plate}
                  </p>
                </div>
              ))
            )}
          </div>

          {/* ACTIVE REPAIRS */}
          <div className="bg-red-600 border border-red-400 shadow-2xl text-white p-14 rounded-3xl">
            <h2 className="text-5xl font-bold flex items-center gap-5 mb-10">
              <Wrench className="w-11 h-11" />
              Active Repairs{repairs.length > 0 ? ` (${repairs.length})` : ""}
            </h2>

            {repairs.length === 0 ? (
              <p className="text-black text-3xl font-semibold text-center py-12">
                No active repairs
              </p>
            ) : (
              repairs.map((repair) => (
                <Link
                  key={repair.id}
                  href={`/client/repair-status/${repair.id}`}
                  className="block p-8 bg-black/30 rounded-2xl border border-white mb-6 hover:bg-black/40 transition text-3xl"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-bold">{repair.repairType}</p>
                      <p className="opacity-80">
                      {repair.car.brand} {repair.car.model} ({repair.car.plateNumber ?? repair.car.plate})
                      {" • "}
                      {repair.cost && repair.cost > 0 ? `${repair.cost} €` : "Pending quote"}
                      </p>
                    </div>

                    <Badge
                      className={`${statusColors[repair.status]} px-6 py-4 text-2xl rounded-2xl`}
                    >
                      {repair.status.replace("_", " ")}
                    </Badge>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
