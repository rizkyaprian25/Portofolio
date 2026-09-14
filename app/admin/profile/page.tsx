import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getProfile } from "@/lib/db";
import ProfileEditor from "@/components/admin/ProfileEditor";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const profile = getProfile();

  return <ProfileEditor initialProfile={profile} />;
}
