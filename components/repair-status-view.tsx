"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Car, Calendar, Clock, FileText } from "lucide-react"

// Mock data - will be fetched from API based on repairId
const mockRepairData = {
  id: 1,
  carInfo: {
    brand: "Toyota",
    model: "Camry",
    year: 2020,
    licensePlate: "ABC-123",
  },
  repairType: "Oil Change",
  status: "IN_PROGRESS",
  requestedDate: "2025-01-15",
  estimatedCompletion: "2025-01-16",
  notes: [
    { id: 1, date: "2025-01-15 10:00", author: "Mechanic John", text: "Vehicle received. Starting inspection." },
    { id: 2, date: "2025-01-15 14:30", author: "Mechanic John", text: "Oil filter needs replacement. Ordering part." },
    { id: 3, date: "2025-01-16 09:00", author: "Mechanic John", text: "Part received. Completing oil change now." },
  ],
  timeline: [
    { status: "PENDING", date: "2025-01-15 09:00", completed: true },
    { status: "IN_PROGRESS", date: "2025-01-15 10:00", completed: true },
    { status: "FINISHED", date: null, completed: false },
    { status: "READY_FOR_PICKUP", date: null, completed: false },
  ],
}

const statusColors: Record<string, string> = {
  PENDING: "bg-muted text-muted-foreground",
  IN_PROGRESS: "bg-primary/20 text-primary",
  WAITING_FOR_PARTS: "bg-accent/20 text-accent",
  FINISHED: "bg-chart-3/20 text-chart-3",
  READY_FOR_PICKUP: "bg-chart-3/30 text-chart-3",
}

export function RepairStatusView({ repairId }: { repairId: string }) {
  // TODO: Fetch data from API using repairId
  const repair = mockRepairData

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/client/dashboard">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Link>
      </Button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">Repair Details</CardTitle>
                  <CardDescription>Repair ID: #{repairId}</CardDescription>
                </div>
                <Badge className={statusColors[repair.status]}>{repair.status.replace("_", " ")}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Car className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-semibold">Vehicle</p>
                    <p className="text-sm text-muted-foreground">
                      {repair.carInfo.brand} {repair.carInfo.model} {repair.carInfo.year}
                    </p>
                    <p className="text-sm text-muted-foreground">{repair.carInfo.licensePlate}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-semibold">Repair Type</p>
                    <p className="text-sm text-muted-foreground">{repair.repairType}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-semibold">Requested Date</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(repair.requestedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="font-semibold">Estimated Completion</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(repair.estimatedCompletion).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mechanic Notes */}
          <Card>
            <CardHeader>
              <CardTitle>Mechanic Notes</CardTitle>
              <CardDescription>Updates from our service team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {repair.notes.map((note) => (
                  <div key={note.id} className="border-l-2 border-primary pl-4 py-2">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold">{note.author}</p>
                      <span className="text-xs text-muted-foreground">{note.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{note.text}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Status Timeline</CardTitle>
              <CardDescription>Repair progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {repair.timeline.map((item, index) => (
                  <div key={index} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${item.completed ? "bg-primary" : "bg-muted"}`} />
                      {index < repair.timeline.length - 1 && (
                        <div className={`w-px h-12 ${item.completed ? "bg-primary" : "bg-muted"}`} />
                      )}
                    </div>
                    <div className="pb-4">
                      <p
                        className={`font-semibold text-sm ${
                          item.completed ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {item.status.replace("_", " ")}
                      </p>
                      {item.date && <p className="text-xs text-muted-foreground">{item.date}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
