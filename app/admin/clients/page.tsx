"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Trash2, ArrowLeft, Users } from "lucide-react";

import { AdminLayout } from "@/components/admin-layout";
import { getAllCustomers, deleteCustomer } from "@/api/customer";
import { getAllCars } from "@/api/cars";

export default function AdminClientsPage() {
  const [clients, setClients] = useState<any[]>([]);
  const [cars, setCars] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [query, setQuery] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const [usersData, carsData] = await Promise.all([
          getAllCustomers(),
          getAllCars(),
        ]);

        const onlyUsers = usersData.filter((u: any) =>
          u.roles?.includes("ROLE_USER")
        );

        setClients(onlyUsers);
        setCars(carsData);
      } catch (e) {
        console.error(e);
        setError("Failed to load clients");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filteredClients = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return clients;

    return clients.filter((c) => {
      const name = `${c.firstName ?? ""} ${c.lastName ?? ""}`.toLowerCase();
      const email = (c.email ?? "").toLowerCase();
      return name.includes(q) || email.includes(q);
    });
  }, [clients, query]);

  const handleDelete = async (id: number) => {
    const ok = confirm("Are you sure you want to delete this customer?");
    if (!ok) return;

    try {
      await deleteCustomer(id);
      setClients((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete customer");
    }
  };

  const getClientDisplayName = (c: any) => {
    const fullName = `${c.firstName ?? ""} ${c.lastName ?? ""}`.trim();
    if (fullName) return fullName;
    if (c.name) return c.name;
    if (c.username) return c.username;
    if (c.email) return c.email.split("@")[0];
    return "Unnamed";
  };

  const carsByUserId = useMemo(() => {
    const map = new Map<number, number>();

    for (const car of cars) {
      const userId = car.customerId ?? car.customer?.id;
      if (!userId) continue;

      map.set(userId, (map.get(userId) ?? 0) + 1);
    }

    return map;
  }, [cars]);

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
              <Users className="w-12 h-12 text-red-500" />
              <h1 className="text-5xl font-bold text-red-500">Manage Clients</h1>
            </div>

            <Link
              href="/admin/dashboard"
              className="flex items-center gap-4 px-8 py-5 bg-white text-black hover:bg-gray-200 rounded-2xl font-bold text-2xl"
            >
              <ArrowLeft className="w-7 h-7" />
              Back
            </Link>
          </header>

          <div className="mb-10">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full px-6 py-5 rounded-2xl bg-black/40 border border-white text-white text-2xl outline-none focus:border-red-500"
            />
          </div>

          <section className="bg-red-600 border border-red-400 shadow-2xl text-white p-12 rounded-3xl">
            {loading ? (
              <p className="text-3xl font-semibold text-center py-12">
                Loading...
              </p>
            ) : error ? (
              <p className="text-3xl font-semibold text-center py-12 text-black">
                {error}
              </p>
            ) : filteredClients.length === 0 ? (
              <p className="text-3xl font-semibold text-center py-12 text-black">
                No clients found
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-2xl">
                  <thead>
                    <tr className="border-b border-white/50">
                      <th className="py-6">Client</th>
                      <th className="py-6">Email</th>
                      <th className="py-6 text-center">Cars</th>
                      <th className="py-6 text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredClients.map((c) => (
                      <tr
                        key={c.id}
                        className="border-b border-white/30 hover:bg-black/20 transition"
                      >
                        <td className="py-6 font-bold">
                          {getClientDisplayName(c)}
                        </td>

                        <td className="py-6 opacity-90">{c.email}</td>

                        <td className="py-6 text-center font-bold">
                          {carsByUserId.get(c.customerId ?? c.id) ?? 0}
                        </td>

                        <td className="py-6 text-right">
                          <button
                            onClick={() => handleDelete(c.id)}
                            className="inline-flex items-center gap-3 px-6 py-4 bg-black/40 border border-white rounded-2xl hover:bg-black/60 transition font-bold"
                          >
                            <Trash2 className="w-6 h-6" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </main>
    </AdminLayout>
  );
}







