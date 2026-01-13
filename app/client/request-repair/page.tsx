"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Wrench, ArrowLeft } from "lucide-react";

import { getMyCars } from "@/api/cars";
import { createOrder } from "@/api/repairs";

export default function RequestRepairPage() {
  const router = useRouter();

  const [cars, setCars] = useState<any[]>([]);
  const [carId, setCarId] = useState("");
  const [repairType, setRepairType] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getMyCars()
      .then(setCars)
      .catch(() => setError("Failed to load cars"));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!carId || !repairType || !date) {
      setError("All fields are required");
      return;
    }

    try {
      await createOrder(Number(carId), {
        description: repairType,
        creationDate: date,
      });

      router.push("/client/dashboard");
    } catch {
      setError("Failed to submit repair request");
    }
  };

  return (
    <main
      className="min-h-screen text-white flex flex-col items-center py-24"
      style={{
        backgroundImage: "url('/workshop.bg.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="min-h-screen w-full bg-black/70 flex flex-col items-center py-24">
        {/* BACK */}
        <div className="w-full max-w-[1700px] px-10 mb-12">
          <Link
            href="/client/dashboard"
            className="flex items-center gap-4 text-red-500 hover:text-red-400 text-2xl font-semibold"
          >
            <ArrowLeft className="w-7 h-7" />
            Back to Dashboard
          </Link>
        </div>

        {/* CARD */}
        <div className="w-full max-w-[1000px] bg-red-600 border border-red-400 rounded-3xl shadow-2xl p-16">
          <h1 className="text-5xl font-bold flex items-center gap-5 mb-12">
            <Wrench className="w-12 h-12" />
            Request Repair
          </h1>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-10"
          >
            {/* CAR */}
            <div>
              <label className="block text-2xl font-semibold mb-3">
                Select Vehicle
              </label>
              <select
                value={carId}
                onChange={(e) => setCarId(e.target.value)}
                className="w-full px-6 py-4 text-2xl rounded-xl bg-black border border-white"
                required
              >
                <option value="">Choose a car</option>
                {cars.map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.brand} {car.model} ({car.year})
                  </option>
                ))}
              </select>
            </div>

            {/* REPAIR TYPE */}
            <div>
              <label className="block text-2xl font-semibold mb-3">
                Repair Type
              </label>
              <select
                value={repairType}
                onChange={(e) => setRepairType(e.target.value)}
                className="w-full px-6 py-4 text-2xl rounded-xl bg-black border border-white"
                required
              >
                <option value="">Choose repair type</option>
                <option value="Oil change">Oil change</option>
                <option value="Brakes">Brakes</option>
                <option value="Engine check">Engine check</option>
                <option value="General inspection">General inspection</option>
              </select>
            </div>

            {/* DATE */}
            <div className="md:col-span-2">
              <label className="block text-2xl font-semibold mb-3">
                Desired Appointment Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-6 py-4 text-2xl rounded-xl bg-black border border-white"
                required
              />
            </div>

            {/* ERROR */}
            {error && (
              <p className="col-span-full text-black bg-white/80 text-xl font-semibold px-6 py-4 rounded-xl">
                {error}
              </p>
            )}

            {/* SUBMIT */}
            <div className="col-span-full mt-6">
              <button
                type="submit"
                className="w-full bg-black hover:bg-white hover:text-black
                           text-white text-3xl font-bold py-6 rounded-2xl
                           transition border border-white"
              >
                Submit Repair Request
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
