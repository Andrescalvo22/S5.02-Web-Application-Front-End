"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Car, Plus, Wrench, LogOut, Calendar } from "lucide-react"

// API imports
import { getMyCars } from "@/api/cars"
import { getMyOrders } from "@/api/repairs"
import { logout } from "@/api/auth"

const statusColors: Record<string, string> = {
  PENDING: "bg-muted text-muted-foreground",
  IN_PROGRESS: "bg-primary/20 text-primary",
  WAITING_FOR_PARTS: "bg-accent/20 text-accent",
  FINISHED: "bg-chart-3/20 text-chart-3",
  READY_FOR_PICKUP: "bg-chart-3/30 text-chart-3",
}

export function ClientDashboard() {
  const [cars, setCars] = useState<any[]>([])
  const [repairs, setRepairs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadData = async () => {
      try {
        const carsData = await getMyCars()
        const repairsData = await getMyOrders()

        setCars(carsData)
        setRepairs(repairsData)
      } catch (err: any) {
        console.error(err)
        setError("Failed to load dashboard data.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  if (loading) {
    return <p className="text-center py-10">Loading dashboard...</p>
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wrench className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Client Dashboard</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={logout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Button asChild>
            <Link href="/client/register-car">
              <Plus className="h-4 w-4 mr-2" />
              Register Car
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/client/request-repair">
              <Calendar className="h-4 w-4 mr-2" />
              Request Repair
            </Link>
          </Button>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* My Cars */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5 text-primary" />
                My Cars
              </CardTitle>
              <CardDescription>Vehicles registered to your account</CardDescription>
            </CardHeader>
            <CardContent>
              {cars.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No cars registered yet</p>
              ) : (
                <div className="space-y-3">
                  {cars.map((car) => (
                    <div
                      key={car.id}
                      className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">
                            {car.brand} {car.model}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {car.year} • {car.plate}
                          </p>
                        </div>
                        <Car className="h-8 w-8 text-muted-foreground" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Repairs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5 text-primary" />
                Active Repairs
              </CardTitle>
              <CardDescription>Your current repair requests</CardDescription>
            </CardHeader>
            <CardContent>
              {repairs.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No active repairs</p>
              ) : (
                <div className="space-y-3">
                  {repairs.map((repair) => (
                    <Link
                      key={repair.id}
                      href={`/client/repair-status/${repair.id}`}
                      className="block p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold">{repair.repairType}</p>
                          <p className="text-sm text-muted-foreground">
                            {repair.car.brand} {repair.car.model} ({repair.car.plate})
                          </p>
                        </div>
                        <Badge className={statusColors[repair.status]}>
                          {repair.status.replace("_", " ")}
                        </Badge>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        Requested: {new Date(repair.requestedDate).toLocaleDateString()}
                      </p>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
