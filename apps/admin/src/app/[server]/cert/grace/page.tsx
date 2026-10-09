import type { Metadata } from "next";

import { getCurrentServer } from "@/shared/server";
import { CertGraceView } from "@/views/cert-grace";

export const metadata: Metadata = { title: "유예 기간" };

export default async function CertGracePage() {
  const server = await getCurrentServer();
  return <CertGraceView enforcementDate={server.certEnforcementDate} />;
}
