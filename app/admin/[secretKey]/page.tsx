import { notFound, redirect } from "next/navigation";
import { getAdminSecretPath } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import AdminLoginClient from "./AdminLoginClient";

export const dynamic = "force-dynamic";

interface Props {
  params: {
    secretKey: string;
  };
}

export default async function SecretAdminLoginPage({ params }: Props) {
  const currentSecret = getAdminSecretPath();

  // If secretKey in URL doesn't match the configured secret code, return 404 Not Found
  if (params.secretKey !== currentSecret) {
    notFound();
  }

  // If user is already authenticated, take them directly into the admin dashboard
  const authed = await isAuthenticated();
  if (authed) {
    redirect("/admin");
  }

  return <AdminLoginClient secretKey={params.secretKey} />;
}
