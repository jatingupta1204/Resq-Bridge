import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Incident from "@/models/Incident";
import Responder from "@/models/Responder";

export async function GET() {
  try {
    await connectDB();

    // Get total incidents
    const totalIncidents = await Incident.countDocuments();

    // Get active responders
    const activeResponders = await Responder.countDocuments({ isAvailable: true });

    // Get resolved incidents for response rate calculation
    const resolvedIncidents = await Incident.countDocuments({ status: "resolved" });
    const responseRate = totalIncidents > 0 ? ((resolvedIncidents / totalIncidents) * 100).toFixed(1) : "0.0";

    // Calculate average response time for resolved incidents
    const incidents = await Incident.find({ status: "resolved" }).select("timestamp resolutionTime");
    
    let totalResponseTime = 0;
    incidents.forEach((incident) => {
      if (incident.timestamp && incident.resolutionTime) {
        totalResponseTime += new Date(incident.resolutionTime).getTime() - new Date(incident.timestamp).getTime();
      }
    });

    const avgResponseTime = incidents.length > 0 ? (totalResponseTime / incidents.length / 60000).toFixed(1) + "m" : "N/A";

    return NextResponse.json({
      totalIncidents,
      activeResponders,
      responseRate,
      avgResponseTime,
      incidentGrowth: "+20.1% from last month",
      responderChange: "+12 since last hour",
      responseRateChange: "+2.1% from last week",
      responseTimeChange: "-30s from last week",
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}