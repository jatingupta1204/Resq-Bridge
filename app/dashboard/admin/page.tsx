"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Overview } from "@/components/admin/overview";
import { RecentIncidents } from "@/components/admin/recent-incidents";
import { IncidentMap } from "@/components/admin/incident-map";
import { Users2, AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface DashboardStats {
  totalIncidents: number;
  activeResponders: number;
  responseRate: string; // FIXED: Changed from number to string
  avgResponseTime: string;
  incidentGrowth: string;
  responderChange: string;
  responseRateChange: string;
  responseTimeChange: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalIncidents: 0,
    activeResponders: 0,
    responseRate: "0",
    avgResponseTime: "N/A",
    incidentGrowth: "0%",
    responderChange: "0",
    responseRateChange: "0%",
    responseTimeChange: "0s",
  });  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch("/api/dashboard/stats");

        if (!response.ok) {
          throw new Error(`Error ${response.status}: Failed to fetch data`);
        }

        const data: DashboardStats = await response.json();
        setStats(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading dashboard data...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalIncidents}</div>
            <p className="text-xs text-muted-foreground">{stats.incidentGrowth}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Responders</CardTitle>
            <Users2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeResponders}</div>
            <p className="text-xs text-muted-foreground">{stats.responderChange}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.responseRate}%</div>
            <p className="text-xs text-muted-foreground">{stats.responseRateChange}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgResponseTime}</div>
            <p className="text-xs text-muted-foreground">{stats.responseTimeChange}</p>
          </CardContent>
        </Card>
      </div>

      {/* Overview & Recent Incidents */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <RecentIncidents />
          </CardContent>
        </Card>
      </div>

      {/* Live Incident Map */}
      <Card className="col-span-7">
        <CardHeader>
          <CardTitle>Live Incident Map</CardTitle>
        </CardHeader>
        <CardContent>
          <IncidentMap />
        </CardContent>
      </Card>
    </div>
  );
}