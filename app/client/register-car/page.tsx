"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Car, ArrowLeft } from "lucide-react";
import { createCar } from "@/api/cars";

export default function RegisterCarPage() {
  const router = useRouter();

  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [plateNumber, setPlateNumber] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const yearNum = Number(year);
    const maxYear = new Date().getFullYear() + 1;

    if (!yearNum || yearNum < 1950 || yearNum > maxYear) {
      setError(`Year must be between 1950 and ${maxYear}`);
      return;
    }

    try {
      await createCar({
        brand,
        model,
        year: yearNum,
        plate: plateNumber,
      });

      router.push("/client/dashboard");
    } catch {
      setError("Error registering the car.");
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
            <Car className="w-12 h-12" />
            Register New Car
          </h1>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-10"
          >
            <div>
              <label className="block text-2xl font-semibold mb-3">Brand</label>
              <input
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-6 py-4 text-2xl rounded-xl bg-black border border-white"
                required
              />
            </div>

            <div>
              <label className="block text-2xl font-semibold mb-3">Model</label>
              <input
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-6 py-4 text-2xl rounded-xl bg-black border border-white"
                required
              />
            </div>

            <div>
              <label className="block text-2xl font-semibold mb-3">Year</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                min={1950}
                max={new Date().getFullYear() + 1}
                placeholder="e.g. 2017"
                className="w-full px-6 py-4 text-2xl rounded-xl bg-black border border-white"
                required
              />
            </div>

            <div>
              <label className="block text-2xl font-semibold mb-3">
                License Plate
              </label>
              <input
                value={plateNumber}
                onChange={(e) => setPlateNumber(e.target.value)}
                className="w-full px-6 py-4 text-2xl rounded-xl bg-black border border-white"
                required
              />
            </div>

            {error && (
              <p className="col-span-full text-black bg-white/80 text-xl font-semibold px-6 py-4 rounded-xl">
                {error}
              </p>
            )}

            <div className="col-span-full mt-6">
              <button
                type="submit"
                className="w-full bg-black hover:bg-white hover:text-black text-white text-3xl font-bold py-6 rounded-2xl transition border border-white"
              >
                Register Car
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
