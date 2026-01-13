"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Wrench } from "lucide-react";

import { AdminLayout } from "@/components/admin-layout";
import { getAllOrders, deleteOrder, updateOrder } from "@/api/repairs";
import { getAllCars } from "@/api/cars";
import { getAllCustomers } from "@/api/customer";

type OrderRow = any;

type UserFromUsersEndpoint = {
  id: number;
  email?: string;
  customerId?: number | null;
  name?: string;
  username?: string;
};

type CarRow = any;

const statusOptionsFixed = ["PENDING", "IN_PROGRESS", "READY_FOR_PICKUP", "CLOSED"];

export default function AdminRepairsPage() {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [cars, setCars] = useState<CarRow[]>([]);
  const [users, setUsers] = useState<UserFromUsersEndpoint[]>([]);

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [selectedStatus, setSelectedStatus] = useState<Record<number, string>>({});
  const [editedCost, setEditedCost] = useState<Record<number, number | string>>({});

  const loadData = async () => {
    try {
      setLoading(true);

      const [ordersRes, carsRes, usersRes] = await Promise.all([
        getAllOrders(),
        getAllCars(),
        getAllCustomers(),
      ]);

      setOrders(ordersRes);
      setCars(carsRes);
      setUsers(usersRes);
    } catch (e) {
      console.error("Error loading repairs", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const usersByCustomerId = useMemo(() => {
    const map = new Map<number, UserFromUsersEndpoint>();
    for (const u of users) {
      if (u.customerId !== null && u.customerId !== undefined) {
        map.set(u.customerId, u);
      }
    }
    return map;
  }, [users]);

  const carsById = useMemo(() => {
    const map = new Map<number, any>();
    for (const c of cars) map.set(c.id, c);
    return map;
  }, [cars]);

  const normalizedOrders = useMemo(() => {
    return orders.map((o: any) => {
      const carId = o.car?.id ?? o.carId ?? null;
      const car = carId ? carsById.get(carId) ?? o.car : o.car;

      const customerId =
        car?.customerId ??
        car?.customer?.id ??
        o.car?.customerId ??
        o.car?.customer?.id ??
        null;

      const user = customerId ? usersByCustomerId.get(customerId) : undefined;

      return {
        ...o,
        car,
        customerId,
        user,
      };
    });
  }, [orders, carsById, usersByCustomerId]);

  const filteredOrders = useMemo(() => {
    const q = search.toLowerCase().trim();

    return normalizedOrders.filter((o: any) => {
      const email = (o.user?.email ?? "").toLowerCase();
      const name = (
        o.user?.name ??
        o.user?.username ??
        (o.user?.email ? o.user.email.split("@")[0] : "")
      ).toLowerCase();

      const brand = (o.car?.brand ?? "").toLowerCase();
      const model = (o.car?.model ?? "").toLowerCase();
      const plate = (o.car?.plateNumber ?? o.car?.plate ?? "").toLowerCase();

      const status = (o.status ?? "").toLowerCase();
      const desc = (o.description ?? "").toLowerCase();

      const matchesSearch =
        !q ||
        email.includes(q) ||
        name.includes(q) ||
        brand.includes(q) ||
        model.includes(q) ||
        plate.includes(q) ||
        status.includes(q) ||
        desc.includes(q);

      const matchesStatus =
        statusFilter === "ALL" ? true : (o.status ?? "") === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [normalizedOrders, search, statusFilter]);

  const formatDate = (d: any) => {
    if (!d) return "-";
    const date = new Date(d);
    if (isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("es-ES");
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this order?")) return;

    try {
      await deleteOrder(id);
      await loadData();
    } catch (e) {
      console.error(e);
      alert("Failed to delete order");
    }
  };

  const handleUpdate = async (order: any) => {
    const newStatus = selectedStatus[order.id] ?? order.status;

    const rawCost = editedCost[order.id] ?? order.cost ?? 0;
    const parsedCost = Number(rawCost);
    const newCost = isNaN(parsedCost) ? 0 : parsedCost;

    // No cambios = no update
    if (newStatus === order.status && newCost === (order.cost ?? 0)) return;

    try {
      await updateOrder(order.id, {
        ...order,
        status: newStatus,
        cost: newCost,
      });

      await loadData();
    } catch (e) {
      console.error(e);
      alert("Failed to update order");
    }
  };

  return (
    <AdminLayout>
      <main
        className="min-h-screen text-white px-10 py-16"
        style={{
          backgroundImage: "url('/workshop.bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="min-h-screen bg-black/70 rounded-3xl p-12 shadow-2xl">
          <header className="flex items-center justify-between mb-12 border-b border-red-700 pb-8">
            <div className="flex items-center gap-5">
              <Wrench className="w-12 h-12 text-red-500" />
              <h1 className="text-5xl font-bold text-red-500">Manage Repairs</h1>
            </div>

            <Link
              href="/admin/dashboard"
              className="flex items-center gap-4 px-8 py-5 bg-white text-black hover:bg-gray-200 rounded-2xl font-bold text-2xl"
            >
              <ArrowLeft className="w-7 h-7" />
              Back
            </Link>
          </header>

          <div className="flex gap-6 mb-10">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by client, car, plate, type or status..."
              className="flex-1 px-6 py-5 rounded-2xl bg-black/40 border border-white/20 text-white text-xl outline-none focus:border-red-500"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-6 py-5 rounded-2xl bg-black/40 border border-white/20 text-white text-xl font-bold outline-none focus:border-red-500"
            >
              <option value="ALL">All statuses</option>
              {statusOptionsFixed.map((s) => (
                <option key={s} value={s}>
                  {s.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          </div>

          <section className="bg-red-600 border border-red-400 shadow-2xl text-white rounded-3xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xl">
                <thead>
                  <tr className="border-b border-white/40">
                    <th className="px-6 py-6 font-extrabold">Order ID</th>
                    <th className="px-6 py-6 font-extrabold">Client</th>
                    <th className="px-6 py-6 font-extrabold">Car</th>
                    <th className="px-6 py-6 font-extrabold">Plate</th>
                    <th className="px-6 py-6 font-extrabold">Repair Type</th>
                    <th className="px-6 py-6 font-extrabold">Cost (€)</th>
                    <th className="px-6 py-6 font-extrabold">Status</th>
                    <th className="px-6 py-6 font-extrabold">Date</th>
                    <th className="px-6 py-6 font-extrabold text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td className="px-6 py-8" colSpan={9}>
                        Loading orders...
                      </td>
                    </tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr>
                      <td className="px-6 py-8" colSpan={9}>
                        No repair orders found.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((o: any) => {
                      const email = o.user?.email ?? "Unknown";
                      const clientName =
                        o.user?.name ??
                        o.user?.username ??
                        (o.user?.email ? o.user.email.split("@")[0] : "Unknown");

                      const brand = o.car?.brand ?? "-";
                      const model = o.car?.model ?? "-";
                      const plate = o.car?.plateNumber ?? o.car?.plate ?? "-";

                      return (
                        <tr
                          key={o.id}
                          className="border-b border-white/20 hover:bg-black/15 transition"
                        >
                          <td className="px-6 py-7 font-bold">#{o.id}</td>

                          <td className="px-6 py-7">
                            <div className="font-bold">{clientName}</div>
                            <div className="text-sm opacity-90">{email}</div>
                          </td>

                          <td className="px-6 py-7 font-bold">
                            {brand} <span className="opacity-95">{model}</span>
                          </td>

                          <td className="px-6 py-7">
                            <span className="inline-flex items-center rounded-lg border border-white/30 bg-black/30 px-4 py-2 font-extrabold tracking-wide">
                              {plate}
                            </span>
                          </td>

                          {/* Repair Type */}
                          <td className="px-6 py-7">
                            {o.description?.trim() ? o.description : "—"}
                          </td>

                          {/* Cost */}
                          <td className="px-6 py-7">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={editedCost[o.id] ?? o.cost ?? 0}
                              onChange={(e) =>
                                setEditedCost((prev) => ({
                                  ...prev,
                                  [o.id]: e.target.value,
                                }))
                              }
                              className="w-32 px-4 py-2 rounded-xl bg-black/40 border border-white/25 text-white font-bold outline-none focus:border-red-500"
                            />
                          </td>

                          {/* Status */}
                          <td className="px-6 py-7 font-bold">
                            <span className="inline-flex items-center rounded-lg border border-white/20 bg-black/20 px-3 py-2">
                              {(o.status ?? "").replaceAll("_", " ")}
                            </span>
                          </td>

                          {/* Date */}
                          <td className="px-6 py-7">{formatDate(o.creationDate)}</td>

                          {/* Actions */}
                          <td className="px-6 py-7 text-right">
                            <div className="inline-flex items-center gap-3">
                              <select
                                value={selectedStatus[o.id] ?? o.status}
                                onChange={(e) =>
                                  setSelectedStatus((prev) => ({
                                    ...prev,
                                    [o.id]: e.target.value,
                                  }))
                                }
                                className="px-4 py-3 rounded-xl bg-black/40 border border-white/25 text-white font-bold"
                              >
                                {statusOptionsFixed.map((s) => (
                                  <option key={s} value={s}>
                                    {s.replaceAll("_", " ")}
                                  </option>
                                ))}
                              </select>

                              <button
                                onClick={() => handleUpdate(o)}
                                className="px-5 py-3 rounded-xl bg-white/15 border border-white/20 font-bold hover:bg-white/20 transition"
                              >
                                Update
                              </button>

                              <button
                                onClick={() => handleDelete(o.id)}
                                className="px-5 py-3 rounded-xl bg-black/40 border border-white/20 font-bold hover:bg-black/55 transition"
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

            <div className="px-6 py-5 text-sm opacity-80">
              Showing {filteredOrders.length} orders
            </div>
          </section>
        </div>
      </main>
    </AdminLayout>
  );
}



