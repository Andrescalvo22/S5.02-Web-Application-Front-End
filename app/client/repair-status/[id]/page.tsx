"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Wrench,
  Car,
  Calendar,
  BadgeCheck,
  DollarSign,
} from "lucide-react";

import { getOrderById } from "@/api/repairs";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-600 text-black",
  IN_PROGRESS: "bg-blue-600 text-white",
  READY_FOR_PICKUP: "bg-green-500 text-black",
  CLOSED: "bg-gray-700 text-white",
};

const timelineSteps = ["PENDING", "IN_PROGRESS", "READY_FOR_PICKUP", "CLOSED"];

export default function RepairStatusPage() {
  const params = useParams();
  const id = Number(params?.id);

  const [loading, setLoading] = useState(true);
  const [repair, setRepair] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id || Number.isNaN(id)) return;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getOrderById(id);
        setRepair(data);
      } catch (e) {
        console.error(e);
        setError("Failed to load repair status");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const formattedDate = (d: any) => {
    if (!d) return "-";
    const date = new Date(d);
    if (isNaN(date.getTime())) return "-";

    return date.toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const currentStepIndex = useMemo(() => {
    const status = repair?.status ?? "PENDING";
    return Math.max(0, timelineSteps.indexOf(status));
  }, [repair]);

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
      <div className="min-h-screen bg-black/70 flex flex-col items-center py-20 px-8">
        {/* BACK */}
        <div className="w-full max-w-[1400px] mb-10">
          <Link
            href="/client/dashboard"
            className="inline-flex items-center gap-3 text-red-500 hover:text-red-400 text-2xl font-bold"
          >
            <ArrowLeft className="w-7 h-7" />
            Back to Dashboard
          </Link>
        </div>

        <div className="w-full max-w-[1400px] bg-black/70 rounded-3xl p-12 shadow-2xl border border-red-700">
          {/* HEADER */}
          <header className="flex items-center justify-between mb-12 border-b border-red-700 pb-8">
            <div className="flex items-center gap-5">
              <Wrench className="w-12 h-12 text-red-500" />
              <h1 className="text-5xl font-bold text-red-500">Repair Status</h1>
            </div>

            {repair?.status && (
              <span
                className={`px-6 py-4 rounded-2xl text-2xl font-bold ${
                  statusColors[repair.status] ?? "bg-gray-700 text-white"
                }`}
              >
                {repair.status.replaceAll("_", " ")}
              </span>
            )}
          </header>

          {/* CONTENT */}
          {loading ? (
            <p className="text-3xl font-semibold text-center py-20">
              Loading repair...
            </p>
          ) : error ? (
            <p className="text-3xl font-semibold text-center py-20 text-red-300">
              {error}
            </p>
          ) : !repair ? (
            <p className="text-3xl font-semibold text-center py-20">
              Repair not found.
            </p>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
              {/* LEFT */}
              <div className="xl:col-span-2 flex flex-col gap-10">
                {/* DETAILS */}
                <section className="bg-red-600 border border-red-400 rounded-3xl shadow-2xl p-10">
                  <h2 className="text-4xl font-extrabold mb-10">
                    Repair Details
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-2xl">
                    <div className="flex items-start gap-4">
                      <Car className="w-9 h-9" />
                      <div>
                        <p className="font-bold">Vehicle</p>
                        <p className="opacity-95">
                          {repair.car?.brand} {repair.car?.model}{" "}
                          {repair.car?.year ? `(${repair.car.year})` : ""}
                        </p>
                        <p className="opacity-90 text-xl mt-1">
                          {repair.car?.plateNumber ?? "-"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <BadgeCheck className="w-9 h-9" />
                      <div>
                        <p className="font-bold">Repair Type</p>
                        <p className="opacity-95">
                          {repair.description?.trim()
                            ? repair.description
                            : "General inspection"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Calendar className="w-9 h-9" />
                      <div>
                        <p className="font-bold">Requested Date</p>
                        <p className="opacity-95">
                          {formattedDate(repair.creationDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <DollarSign className="w-9 h-9" />
                      <div>
                        <p className="font-bold">Cost</p>
                        <p className="opacity-95">{repair.cost ?? 0} €</p>
                      </div>
                    </div>
                  </div>
                </section>

                <section className="bg-red-600 border border-red-400 rounded-3xl shadow-2xl p-10">
                  <h2 className="text-4xl font-extrabold mb-6">
                    Mechanic Notes
                  </h2>

                  <div className="bg-black/25 rounded-2xl border border-white/30 p-8 space-y-6">
                    {repair.notes && repair.notes.length > 0 ? (
                      repair.notes.map((note: any) => (
                        <div
                          key={note.id}
                          className="border-b border-white/20 pb-5 last:border-b-0 last:pb-0"
                        >
                          <p className="text-2xl font-semibold text-white">
                            {note.author ?? "Mechanic"}
                          </p>

                          <p className="text-xl opacity-80">
                            {formattedDate(note.createdAt)}
                          </p>

                          <p className="text-2xl mt-3 opacity-95">
                            {note.text ?? "-"}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-2xl opacity-95">
                        No mechanic notes available yet.
                      </p>
                    )}
                  </div>
                </section>
              </div>

              {/* RIGHT */}
              <aside className="bg-red-600 border border-red-400 rounded-3xl shadow-2xl p-10">
                <h2 className="text-4xl font-extrabold mb-10">
                  Status Timeline
                </h2>

                <div className="flex flex-col gap-7">
                  {timelineSteps.map((step, i) => {
                    const isDone = i <= currentStepIndex;
                    return (
                      <div
                        key={step}
                        className={`rounded-2xl border px-6 py-5 text-2xl font-bold transition ${
                          isDone
                            ? "bg-black/40 border-white"
                            : "bg-black/20 border-white/25 opacity-70"
                        }`}
                      >
                        {step.replaceAll("_", " ")}
                      </div>
                    );
                  })}
                </div>

                {repair.closingDate && (
                  <div className="mt-10 text-xl opacity-90">
                    Closed: {formattedDate(repair.closingDate)}
                  </div>
                )}
              </aside>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

