import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getPortfolioItems, getCv } from "@/lib/db";
import PortfolioManager from "@/components/admin/PortfolioManager";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  const projects = getPortfolioItems();
  const cv = getCv();

  return <PortfolioManager initialProjects={projects} cvData={cv} />;
}
