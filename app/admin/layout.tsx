import React from "react";
import { getSession } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // If unauthenticated, render children without sidebar (e.g. login page)
  if (!session) {
    return <div className="min-h-screen bg-canvas">{children}</div>;
  }

  // If authenticated, render full dashboard layout with sidebar
  return (
    <div className="min-h-screen bg-canvas flex flex-col md:flex-row">
      <AdminSidebar username={session.username} />
      <main className="flex-1 flex flex-col min-w-0 bg-canvas overflow-y-auto max-h-screen">
        {children}
      </main>
    </div>
  );
}
