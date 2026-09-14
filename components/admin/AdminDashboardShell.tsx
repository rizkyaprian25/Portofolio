import React from "react";
import AdminSidebar from "./AdminSidebar";

export default function AdminDashboardShell({
  children,
  username,
}: {
  children: React.ReactNode;
  username: string;
}) {
  return (
    <div className="min-h-screen bg-apple-canvas flex flex-col md:flex-row">
      <AdminSidebar username={username} />
      <main className="flex-1 flex flex-col min-w-0 bg-apple-canvas overflow-y-auto max-h-screen">
        {children}
      </main>
    </div>
  );
}
