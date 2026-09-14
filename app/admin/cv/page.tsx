import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getCv } from "@/lib/db";
import AdminDashboardShell from "@/components/admin/AdminDashboardShell";
import CvManager from "@/components/admin/CvManager";

export const dynamic = "force-dynamic";

export default async function AdminCvPage() {
  const session = await getSession();

  if (!session) {
    notFound();
  }

  const cv = getCv();

  return (
    <AdminDashboardShell username={session.username}>
      <CvManager initialCv={cv} />
    </AdminDashboardShell>
  );
}
