"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { AdminLayout } from "@/components/admin-layout";
import { getAllCars, deleteCar } from "@/api/cars";
import { getAllCustomers } from "@/api/customer";

type UserFromUsersEndpoint = {
  id: number;
  email?: string;
  customerId?: number | null;
  name?: string;
  username?: string;
};

type RawCar = any;

type CarRow = {
  id: number;
  brand: string;
  model: string;
  year?: number;
  plate: string;
  status: string;
  customerId?: number;
  userId?: number;
  user?: UserFromUsersEndpoint;
};

export default function AdminCarsPage() {
  const [cars, setCars] = useState<CarRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const normalizeCar = (car: RawCar): CarRow => {
    const plate =
      car.plateNumber ??
      car.plate ??
      car.licensePlate ??
      car.plate_number ??
      "";

    const status = car.status ?? car.state ?? car.carStatus ?? "";

    const customerId = car.customerId ?? car.customer?.id ?? undefined;

    const userId = car.userId ?? car.user?.id ?? undefined;

    return {
      id: car.id,
      brand: car.brand ?? car.make ?? "",
      model: car.model ?? "",
      year: car.year,
      plate,
      status,
      customerId,
      userId,
    };
  };

  const loadCars = async () => {
    try {
      setLoading(true);

      const [carsRes, usersRes] = await Promise.all([
        getAllCars(),
        getAllCustomers(),
      ]);

      const usersByCustomerId = new Map<number, UserFromUsersEndpoint>();
      const usersByUserId = new Map<number, UserFromUsersEndpoint>();

      (usersRes as UserFromUsersEndpoint[]).forEach((u) => {
        if (u.id) usersByUserId.set(u.id, u);
        if (u.customerId !== null && u.customerId !== undefined) {
          usersByCustomerId.set(u.customerId, u);
        }
      });

      const merged: CarRow[] = (carsRes as RawCar[]).map((raw) => {
        const car = normalizeCar(raw);

        let user = car.customerId
          ? usersByCustomerId.get(car.customerId)
          : undefined;

        if (!user && car.userId) {
          user = usersByUserId.get(car.userId);
        }

        return {
          ...car,
          user,
        };
      });

      setCars(merged);
    } catch (e) {
      console.error("Error loading cars", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCars();
  }, []);

  const filteredCars = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return cars;

    return cars.filter((car) => {
      const email = (car.user?.email ?? "").toLowerCase();
      const plate = (car.plate ?? "").toLowerCase();
      const brand = (car.brand ?? "").toLowerCase();
      const model = (car.model ?? "").toLowerCase();
      const status = (car.status ?? "").toLowerCase();

      const name = (car.user?.name ??
        car.user?.username ??
        (car.user?.email ? car.user.email.split("@")[0] : "")).toLowerCase();

      return (
        email.includes(q) ||
        name.includes(q) ||
        plate.includes(q) ||
        brand.includes(q) ||
        model.includes(q) ||
        status.includes(q)
      );
    });
  }, [cars, search]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this car?")) return;
    try {
      await deleteCar(id);
      await loadCars();
    } catch (e) {
      console.error("Error deleting car", e);
      alert("Error deleting car");
    }
  };

  return (
    <AdminLayout>
      <div className="min-h-screen text-white">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <span className="text-red-500 text-4xl">🚗</span>
            <h1 className="text-4xl font-extrabold text-red-500">
              Manage Cars
            </h1>
          </div>

          <Link
            href="/admin/dashboard"
            className="
              inline-flex items-center gap-2
              rounded-xl bg-white px-6 py-3
              text-black font-bold
              hover:bg-gray-200 transition
            "
          >
            ← Back
          </Link>
        </div>

        <div className="mb-6">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client, email, plate, brand or model..."
            className="
              w-full rounded-xl bg-black/40 border border-white/20
              px-5 py-4 text-lg outline-none
              focus:border-red-500 focus:ring-2 focus:ring-red-500/20
            "
          />
        </div>

        <div className="rounded-2xl bg-red-600/85 shadow-2xl border border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-white text-lg border-b border-white/20">
                  <th className="px-6 py-5 font-extrabold">Client</th>
                  <th className="px-6 py-5 font-extrabold">Email</th>
                  <th className="px-6 py-5 font-extrabold">Car</th>
                  <th className="px-6 py-5 font-extrabold">Year</th>
                  <th className="px-6 py-5 font-extrabold">Plate</th>
                  <th className="px-6 py-5 font-extrabold">Status</th>
                  <th className="px-6 py-5 font-extrabold text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td className="px-6 py-6 text-lg" colSpan={7}>
                      Loading cars...
                    </td>
                  </tr>
                ) : filteredCars.length === 0 ? (
                  <tr>
                    <td className="px-6 py-6 text-lg" colSpan={7}>
                      No cars found.
                    </td>
                  </tr>
                ) : (
                  filteredCars.map((car) => {
                    const email = car.user?.email ?? "-";
                    const clientName =
                      car.user?.name ??
                      car.user?.username ??
                      (car.user?.email
                        ? car.user.email.split("@")[0]
                        : `Client #${car.customerId ?? "?"}`);

                    return (
                      <tr
                        key={car.id}
                        className="border-b border-white/15 hover:bg-black/10 transition"
                      >
                        <td className="px-6 py-6 text-lg font-bold">
                          {clientName}
                        </td>

                        <td className="px-6 py-6 text-base opacity-95">
                          {email}
                        </td>

                        <td className="px-6 py-6 text-lg">
                          <span className="font-extrabold">{car.brand}</span>{" "}
                          <span className="opacity-95">{car.model}</span>
                        </td>

                        <td className="px-6 py-6 text-lg">{car.year ?? "-"}</td>

                        <td className="px-6 py-6 text-lg">
                          <span className="inline-flex items-center rounded-lg border border-white/30 bg-black/30 px-4 py-2 font-extrabold tracking-wide">
                            {car.plate?.trim() ? car.plate : "—"}
                          </span>
                        </td>

                        <td className="px-6 py-6 text-base font-bold">
                          <span className="inline-flex items-center rounded-lg border border-white/20 bg-black/20 px-3 py-2">
                            {car.status?.trim() ? car.status : "—"}
                          </span>
                        </td>

                        <td className="px-6 py-6 text-right">
                          <div className="inline-flex gap-2">
                            <button
                              className="
                                rounded-xl px-4 py-2 text-base font-bold
                                bg-white/15 border border-white/20
                                hover:bg-white/20 transition
                              "
                              onClick={() => alert(`View car ${car.id}`)}
                            >
                              View
                            </button>

                            <button
                              className="
                                rounded-xl px-4 py-2 text-base font-bold
                                bg-black/40 border border-white/20
                                hover:bg-black/50 transition
                              "
                              onClick={() => handleDelete(car.id)}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 text-sm opacity-70">
          Showing {filteredCars.length} cars
        </div>
      </div>
    </AdminLayout>
  );
}









