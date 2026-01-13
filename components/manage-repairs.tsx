"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/admin-layout"

// Mock data - will be replaced with API calls
const mockRepairs = [
  {
    id: 1,
    clientName: "John Smith",
    carInfo: "Toyota Camry (ABC-123)",
    repairType: "Oil Change",
    status: "IN_PROGRESS",
    requestedDate: "2025-01-15",
  },
  {
    id: 2,
    clientName: "Sarah Johnson",
    carInfo: "Ford F-150 (DEF-456)",
    repairType: "Brake Inspection",
    status: "PENDING",
    requestedDate: "2025-01-18",
  },
  {
    id: 3,
    clientName: "Mike Wilson",
    carInfo: "BMW 3 Series (GHI-012)",
    repairType: "Engine Diagnostic",
    status: "WAITING_FOR_PARTS",
    requestedDate: "2025-01-10",
  },
  {
    id: 4,
    clientName: "Emily Brown",
    carInfo: "Mercedes C-Class (JKL-345)",
    repairType: "AC Service",
    status: "FINISHED",
    requestedDate: "2025-01-05",
  },
]

const statusColors: Record<string, string> = {
  PENDING: "bg-muted text-muted-foreground",
  IN_PROGRESS: "bg-primary/20 text-primary",
  WAITING_FOR_PARTS: "bg-accent/20 text-accent",
  FINISHED: "bg-chart-3/20 text-chart-3",
  READY_FOR_PICKUP: "bg-chart-3/30 text-chart-3",
}

export function ManageRepairs() {
  const [repairs] = useState(mockRepairs)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredRepairs = repairs.filter((repair) => {
    const matchesSearch =
      repair.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repair.carInfo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repair.repairType.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || repair.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <AdminLayout>
      <Card>
        <CardHeader>
          <CardTitle>Manage Repairs</CardTitle>
          <CardDescription>View and manage all repair requests</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by client, car, or repair type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="WAITING_FOR_PARTS">Waiting for Parts</SelectItem>
                <SelectItem value="FINISHED">Finished</SelectItem>
                <SelectItem value="READY_FOR_PICKUP">Ready for Pickup</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Repair ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Car</TableHead>
                  <TableHead>Repair Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRepairs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No repairs found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRepairs.map((repair) => (
                    <TableRow key={repair.id}>
                      <TableCell className="font-medium">#{repair.id}</TableCell>
                      <TableCell>{repair.clientName}</TableCell>
                      <TableCell>{repair.carInfo}</TableCell>
                      <TableCell>{repair.repairType}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[repair.status]}>{repair.status.replace("_", " ")}</Badge>
                      </TableCell>
                      <TableCell>{new Date(repair.requestedDate).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/repairs/${repair.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
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
