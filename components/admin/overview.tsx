"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", incidents: 40 },
  { name: "Feb", incidents: 30 },
  { name: "Mar", incidents: 50 },
  { name: "Apr", incidents: 80 },
  { name: "May", incidents: 65 },
  { name: "Jun", incidents: 90 },
  { name: "Jul", incidents: 70 },
];

export function Overview() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="incidents" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  );
}