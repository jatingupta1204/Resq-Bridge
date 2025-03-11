"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"

interface Incident {
  _id: string
  type: string
  location: string
  status: string
  priority: string
  reportedAt: string
  assignedTo: string
}

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await fetch("/api/incidents")
        if (!response.ok) throw new Error("Failed to fetch incidents")
        const data = await response.json()
        setIncidents(data)
      } catch (error) {
        console.error(error)
      }
    }
    fetchIncidents()
  }, [])

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch =
      incident.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.assignedTo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || incident.status === statusFilter
    const matchesType = typeFilter === "all" || incident.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Incident Management</h2>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Search by location or responder..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Medical">Medical</SelectItem>
              <SelectItem value="Fire">Fire</SelectItem>
              <SelectItem value="Security">Security</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Reported At</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIncidents.map((incident) => (
                <TableRow key={incident._id}>
                  <TableCell>{incident.type}</TableCell>
                  <TableCell>{incident.location}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        incident.status === "Active"
                          ? "destructive"
                          : incident.status === "In Progress"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {incident.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={incident.priority === "High" ? "destructive" : "default"}>
                      {incident.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>{incident.reportedAt}</TableCell>
                  <TableCell>{incident.assignedTo}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
