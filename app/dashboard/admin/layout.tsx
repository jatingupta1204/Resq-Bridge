"use client";

import { ReactNode } from "react";
import { Sidebar } from "@/components/admin/sidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-secondary/10 p-6">{children}</main>
    </div>
  );
}
