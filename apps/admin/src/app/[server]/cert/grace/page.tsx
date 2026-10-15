import type { Metadata } from "next";

import { getCurrentServer } from "@/shared/server";
import { CertGraceMobileView, CertGraceView } from "@/views/cert-grace";

export const metadata: Metadata = { title: "유예 기간" };

export default async function CertGracePage() {
  const server = await getCurrentServer();
  return (
    <>
      <div className="contents max-lg:hidden">
        <CertGraceView enforcementDate={server.certEnforcementDate} />
      </div>
      <div className="contents lg:hidden">
        <CertGraceMobileView enforcementDate={server.certEnforcementDate} />
      </div>
    </>
  );
}
