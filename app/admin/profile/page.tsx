import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getProfile } from "@/lib/db";
import AdminDashboardShell from "@/components/admin/AdminDashboardShell";
import ProfileEditor from "@/components/admin/ProfileEditor";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const session = await getSession();

  if (!session) {
    notFound();
  }

  const profile = getProfile();

  return (
    <AdminDashboardShell username={session.username}>
      <ProfileEditor initialProfile={profile} />
    </AdminDashboardShell>
  );
}
