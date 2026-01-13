"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";

// API imports
import { getMyCars } from "@/api/cars";
import { createOrder } from "@/api/repairs"; // ← FIX

export function RequestRepairForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [cars, setCars] = useState<any[]>([]);
  const [loadingCars, setLoadingCars] = useState(true);

  const [formData, setFormData] = useState({
    carId: "",
    repairType: "",
    appointmentDate: "",
  });

  useEffect(() => {
    const loadCars = async () => {
      try {
        const data = await getMyCars();
        setCars(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load your cars.");
      } finally {
        setLoadingCars(false);
      }
    };

    loadCars();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createOrder(Number(formData.carId), {
        repairType: formData.repairType,
        requestedDate: formData.appointmentDate,
      });

      alert("Repair requested successfully!");
      router.push("/client/dashboard");
    } catch (err: any) {
      console.error(err);
      setError("Failed to submit repair request.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingCars)
    return <p className="text-center py-10">Loading cars...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/client/dashboard">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
      </Button>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            Request Repair Appointment
          </CardTitle>
          <CardDescription>
            Schedule a service for your vehicle
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <p className="text-red-500 text-center text-sm">{error}</p>
            )}

            <div className="space-y-2">
              <Label>Select Vehicle</Label>
              <Select
                value={formData.carId}
                onValueChange={(value) =>
                  setFormData({ ...formData, carId: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a car" />
                </SelectTrigger>

                <SelectContent>
                  {cars.map((car) => (
                    <SelectItem
                      key={car.id}
                      value={car.id.toString()}
                    >
                      {car.brand} {car.model} ({car.plate})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Repair Type</Label>
              <Select
                value={formData.repairType}
                onValueChange={(value) =>
                  setFormData({ ...formData, repairType: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose repair type" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="OIL_CHANGE">Oil Change</SelectItem>
                  <SelectItem value="BRAKE_INSPECTION">Brake Inspection</SelectItem>
                  <SelectItem value="TIRE_REPLACEMENT">Tire Replacement</SelectItem>
                  <SelectItem value="ENGINE_DIAGNOSTIC">Engine Diagnostic</SelectItem>
                  <SelectItem value="TRANSMISSION_SERVICE">
                    Transmission Service
                  </SelectItem>
                  <SelectItem value="BATTERY_REPLACEMENT">
                    Battery Replacement
                  </SelectItem>
                  <SelectItem value="AC_SERVICE">AC Service</SelectItem>
                  <SelectItem value="GENERAL_INSPECTION">
                    General Inspection
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Desired Appointment Date</Label>
              <Input
                type="date"
                value={formData.appointmentDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    appointmentDate: e.target.value,
                  })
                }
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Submitting..." : "Submit Request"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

