"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Eye, Trash2 } from "lucide-react"
import { AdminLayout } from "@/components/admin-layout"

// Mock data - will be replaced with API calls
const mockCars = [
  {
    id: 1,
    clientName: "John Smith",
    brand: "Toyota",
    model: "Camry",
    licensePlate: "ABC-123",
  },
  {
    id: 2,
    clientName: "John Smith",
    brand: "Honda",
    model: "Civic",
    licensePlate: "XYZ-789",
  },
  {
    id: 3,
    clientName: "Sarah Johnson",
    brand: "Ford",
    model: "F-150",
    licensePlate: "DEF-456",
  },
  {
    id: 4,
    clientName: "Mike Wilson",
    brand: "BMW",
    model: "3 Series",
    licensePlate: "GHI-012",
  },
]

export function ManageCars() {
  const [cars] = useState(mockCars)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCars = cars.filter(
    (car) =>
      car.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      car.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${car.brand} ${car.model}`.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = (carId: number) => {
    // TODO: Connect to backend API with confirmation
    if (confirm("Are you sure you want to delete this car?")) {
      console.log("[v0] Delete car:", carId)
    }
  }

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>Manage Cars</CardTitle>
          <CardDescription>View and manage all registered vehicles</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="flex items-center gap-2 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by client, license plate, or car..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client Name</TableHead>
                  <TableHead>Car</TableHead>
                  <TableHead>License Plate</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCars.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No cars found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCars.map((car) => (
                    <TableRow key={car.id}>
                      <TableCell className="font-medium">{car.clientName}</TableCell>
                      <TableCell>
                        {car.brand} {car.model}
                      </TableCell>
                      <TableCell>{car.licensePlate}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(car.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </AdminLayout>
  )
}
