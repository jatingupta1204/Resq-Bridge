"use client";

import { useEffect, useState } from "react";

interface Incident {
  _id: string;
  type: string;
  location: string;
  status: string;
  timestamp: string;
}

export function RecentIncidents() {
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    async function fetchIncidents() {
      try {
        const response = await fetch("/api/incidents/recent");
        const data = await response.json();
        setIncidents(data);
      } catch (error) {
        console.error("Error fetching recent incidents:", error);
      }
    }
    fetchIncidents();
  }, []);

  return (
    <div className="space-y-4">
      {incidents.map((incident) => (
        <div key={incident._id} className="border p-2 rounded-md">
          <p className="text-sm font-bold">{incident.type}</p>
          <p className="text-xs text-muted-foreground">{incident.location}</p>
          <p className="text-xs text-muted-foreground">{new Date(incident.timestamp).toLocaleString()}</p>
          <span className={`text-xs font-medium ${incident.status === "resolved" ? "text-green-500" : "text-red-500"}`}>
            {incident.status.toUpperCase()}
          </span>
        </div>
      ))}
    </div>
  );
}
