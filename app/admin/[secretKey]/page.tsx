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

  // Jika secretKey pada URL tidak cocok dengan kode rahasia yang terkonfigurasi, alihkan ke 404 Not Found
  if (params.secretKey !== currentSecret) {
    notFound();
  }

  // Jika sesi admin sudah terautentikasi, arahkan langsung ke dashboard admin
  const authed = await isAuthenticated();
  if (authed) {
    redirect("/admin");
  }

  return <AdminLoginClient secretKey={params.secretKey} />;
}
