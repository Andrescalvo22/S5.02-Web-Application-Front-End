"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Car, User, FileText, Plus, Wrench } from "lucide-react";
import { AdminLayout } from "@/components/admin-layout";

import {
  updateOrder,
  getOrderDetails,   
  getOrderNotes,
  addOrderNote,
} from "@/api/repairs";

type RepairOrder = any;

const statusOptionsFixed = ["PENDING", "IN_PROGRESS", "READY_FOR_PICKUP", "CLOSED"];

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-600 text-black",
  IN_PROGRESS: "bg-blue-600 text-white",
  READY_FOR_PICKUP: "bg-green-500 text-black",
  CLOSED: "bg-gray-700 text-white",
};

export function RepairDetailsAdmin({ repairId }: { repairId: string }) {
  const [loading, setLoading] = useState(true);
  const [repair, setRepair] = useState<RepairOrder | null>(null);

  const [notes, setNotes] = useState<any[]>([]);
  const [newNote, setNewNote] = useState("");

  const [selectedStatus, setSelectedStatus] = useState<string>("PENDING");
  const [saving, setSaving] = useState(false);

  const loadRepair = async () => {
    try {
      
      const data = await getOrderDetails(Number(repairId));

      setRepair(data);
      setSelectedStatus(data?.status ?? "PENDING");
    } catch (e) {
      console.error("Failed to load repair order details", e);
      setRepair(null);
    }
  };

  const loadNotes = async () => {
    try {
      const notesRes = await getOrderNotes(Number(repairId));
      setNotes(notesRes ?? []);
    } catch (e) {
      console.error("Failed to load notes", e);
      setNotes([]);
    }
  };

  const loadAll = async () => {
    try {
      setLoading(true);
      await Promise.all([loadRepair(), loadNotes()]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [repairId]);

  
  const clientName = useMemo(() => {
    return repair?.customerName?.trim() || "Unknown";
  }, [repair]);

  const clientEmail = useMemo(() => {
    return repair?.customerEmail?.trim() || "Unknown";
  }, [repair]);

  const plate = repair?.plateNumber ?? "-";

  const repairType = repair?.description?.trim() ? repair.description : "—";

  const requestedDate = repair?.creationDate
    ? new Date(repair.creationDate).toLocaleDateString("es-ES")
    : "-";

  const statusBadge = repair?.status ?? "PENDING";

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      
      await addOrderNote(Number(repairId), { text: newNote.trim() });

      setNewNote("");
      await loadNotes();
    } catch (e) {
      console.error("Failed to add note", e);
      alert("Failed to add note");
    }
  };

  const handleSaveChanges = async () => {
    if (!repair) return;
    if (!selectedStatus || selectedStatus === repair.status) return;

    try {
      setSaving(true);

      await updateOrder(Number(repairId), {
        ...repair,
        status: selectedStatus,
      });

      await loadRepair();
      alert("Changes saved successfully!");
    } catch (e) {
      console.error("Failed to save changes", e);
      alert("Failed to save changes");
    } finally {
      setSaving(false);
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
          {/* HEADER */}
          <div className="flex items-center justify-between mb-12 border-b border-red-700 pb-8">
            <div className="flex items-center gap-5">
              <Wrench className="w-12 h-12 text-red-500" />
              <h1 className="text-5xl font-bold text-red-500">
                Repair Details
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild className="text-white">
                <Link href="/admin/repairs">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Link>
              </Button>

              <Button
                onClick={handleSaveChanges}
                disabled={!repair || saving}
                className="bg-white text-black hover:bg-gray-200 font-bold"
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>

          {loading ? (
            <p className="text-3xl font-semibold text-center py-20">
              Loading repair details...
            </p>
          ) : !repair ? (
            <p className="text-3xl font-semibold text-center py-20 text-red-300">
              Repair order not found.
            </p>
          ) : (
            <div className="grid lg:grid-cols-3 gap-10">
              {/* MAIN */}
              <div className="lg:col-span-2 space-y-10">
                <Card className="bg-black/30 border border-white/10 text-white rounded-3xl shadow-2xl">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-3xl mb-2 text-red-500">
                          Repair #{repairId}
                        </CardTitle>
                        <CardDescription className="text-white/70">
                          Full repair details and customer info
                        </CardDescription>
                      </div>

                      <Badge
                        className={`px-6 py-3 rounded-2xl text-xl font-bold ${
                          statusColors[statusBadge] ?? "bg-gray-700 text-white"
                        }`}
                      >
                        {statusBadge.replaceAll("_", " ")}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-10">
                    {/* CLIENT */}
                    <div>
                      <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                        <User className="h-6 w-6 text-red-400" />
                        Client Information
                      </h3>
                      <div className="space-y-2 pl-8 text-xl">
                        <p>
                          <span className="text-white/70">Name:</span>{" "}
                          <span className="font-bold">{clientName}</span>
                        </p>
                        <p>
                          <span className="text-white/70">Email:</span>{" "}
                          <span className="font-bold">{clientEmail}</span>
                        </p>
                      </div>
                    </div>

                    {/* CAR */}
                    <div>
                      <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                        <Car className="h-6 w-6 text-red-400" />
                        Vehicle Information
                      </h3>
                      <div className="space-y-2 pl-8 text-xl">
                        <p>
                          <span className="text-white/70">Car:</span>{" "}
                          <span className="font-bold">
                            {repair?.brand ?? "-"} {repair?.model ?? "-"}{" "}
                            {repair?.year ?? ""}
                          </span>
                        </p>
                        <p>
                          <span className="text-white/70">Plate:</span>{" "}
                          <span className="font-bold">{plate}</span>
                        </p>
                      </div>
                    </div>

                    {/* REPAIR INFO */}
                    <div>
                      <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                        <FileText className="h-6 w-6 text-red-400" />
                        Repair Information
                      </h3>
                      <div className="space-y-2 pl-8 text-xl">
                        <p>
                          <span className="text-white/70">Type:</span>{" "}
                          <span className="font-bold">{repairType}</span>
                        </p>
                        <p>
                          <span className="text-white/70">Requested:</span>{" "}
                          <span className="font-bold">{requestedDate}</span>
                        </p>
                        <p>
                          <span className="text-white/70">Cost (€):</span>{" "}
                          <span className="font-bold">
                            {Number(repair?.cost ?? 0).toFixed(2)}
                          </span>
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* NOTES */}
                <Card className="bg-black/30 border border-white/10 text-white rounded-3xl shadow-2xl">
                  <CardHeader>
                    <CardTitle className="text-3xl text-red-500">
                      Mechanic Notes
                    </CardTitle>
                    <CardDescription className="text-white/70">
                      Updates and progress notes
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* EXISTING NOTES */}
                    {notes.length === 0 ? (
                      <p className="text-white/80 text-xl">
                        No mechanic notes available yet.
                      </p>
                    ) : (
                      notes.map((note) => (
                        <div
                          key={note.id}
                          className="border-l-4 border-red-500 pl-6 py-3"
                        >
                          <div className="flex items-center gap-3 mb-1">
                            <p className="text-xl font-bold">
                              {note.author ?? "Mechanic"}
                            </p>
                            <span className="text-sm text-white/70">
                              {note.createdAt
                                ? new Date(note.createdAt).toLocaleString("es-ES")
                                : ""}
                            </span>
                          </div>
                          <p className="text-xl text-white/80 leading-relaxed">
                            {note.text}
                          </p>
                        </div>
                      ))
                    )}

                    {/* ADD NOTE */}
                    <div className="space-y-3 pt-6 border-t border-white/10">
                      <Label htmlFor="newNote" className="text-xl font-bold">
                        Add New Note
                      </Label>

                      <Textarea
                        id="newNote"
                        placeholder="Enter note details..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        rows={4}
                        className="bg-black/40 border border-white/20 text-white text-lg"
                      />

                      <Button
                        onClick={handleAddNote}
                        className="bg-white text-black hover:bg-gray-200 font-bold"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Add Note
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* STATUS CONTROL */}
              <div>
                <Card className="bg-black/30 border border-white/10 text-white rounded-3xl shadow-2xl">
                  <CardHeader className="text-white">
                    <CardTitle className="text-3xl text-red-500">
                      Update Status
                    </CardTitle>
                    <CardDescription className="text-white/80">
                      Change repair status
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      <Label htmlFor="status" className="text-xl font-bold">
                        Current Status
                      </Label>

                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
  <SelectTrigger
    id="status"
    className="bg-black/40 border border-white/20 text-white font-bold"
  >
    <SelectValue placeholder="Select status" />
  </SelectTrigger>

  <SelectContent className="bg-black text-white border border-white/20">
    {statusOptionsFixed.map((s) => (
      <SelectItem
        key={s}
        value={s}
        className="text-white focus:bg-white/20 focus:text-white"
      >
        {s.replaceAll("_", " ")}
      </SelectItem>
    ))}
  </SelectContent>
</Select>

                    </div>

                    <p className="text-sm text-white/70 leading-relaxed">
                      Update the repair status to keep the client informed.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </main>
    </AdminLayout>
  );
}

