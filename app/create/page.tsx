import { cookies } from "next/headers";

import CreateCertificateForm from "./CreateCertificateForm";
import PasswordGate from "./PasswordGate";
import { AUTH_COOKIE_NAME, getAuthConfig, verifyAuthToken } from "@/lib/auth";

export default async function CreatePage() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const { secret } = getAuthConfig();

  if (!authToken || !secret || !verifyAuthToken(authToken, secret)) {
    return <PasswordGate />;
  }

  return <CreateCertificateForm />;
}
