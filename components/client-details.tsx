"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Mail, User, Car, Trash2 } from "lucide-react"
import { AdminLayout } from "@/components/admin-layout"

// Mock data - will be fetched from API based on clientId
const mockClientData = {
  id: 1,
  name: "John Smith",
  email: "john@example.com",
  registeredDate: "2024-12-01",
  cars: [
    { id: 1, brand: "Toyota", model: "Camry", year: 2020, licensePlate: "ABC-123" },
    { id: 2, brand: "Honda", model: "Civic", year: 2019, licensePlate: "XYZ-789" },
  ],
}

export function ClientDetails({ clientId }: { clientId: string }) {
  // TODO: Fetch data from API using clientId
  const client = mockClientData

  const handleDeleteClient = () => {
    if (
      confirm(
        `Are you sure you want to delete ${client.name}? This will also delete all their cars and repair records.`,
      )
    ) {
      console.log("[v0] Delete client:", clientId)
      // TODO: Connect to backend API
    }
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href="/admin/clients">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Clients
            </Link>
          </Button>
          <Button variant="destructive" onClick={handleDeleteClient}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Client
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
            <CardDescription>Details for client #{clientId}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-semibold">{client.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-semibold">{client.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Car className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Registered Since</p>
                <p className="font-semibold">{new Date(client.registeredDate).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Client&apos;s Cars</CardTitle>
            <CardDescription>Vehicles registered by this client</CardDescription>
          </CardHeader>
          <CardContent>
            {client.cars.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No cars registered</p>
            ) : (
              <div className="space-y-3">
                {client.cars.map((car) => (
                  <div key={car.id} className="p-4 border border-border rounded-lg flex items-center justify-between">
                    <div>
                      <p className="font-semibold">
                        {car.brand} {car.model}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {car.year} • {car.licensePlate}
                      </p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/repairs?carId=${car.id}`}>View Repairs</Link>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
