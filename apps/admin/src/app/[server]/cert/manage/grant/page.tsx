import type { Metadata } from "next";

import { getGrantOptions } from "@/entities/cert/server";
import { getCurrentServer, requireStaff } from "@/shared/server";
import { CertGrantMobileView, CertGrantView } from "@/views/cert-grant";

export const metadata: Metadata = { title: "인증 부여" };

export default async function CertGrantPage() {
  const [options, server] = await Promise.all([
    getGrantOptions(),
    getCurrentServer(),
    requireStaff(),
  ]);
  const staffChannel = Boolean(server.staffChannelId);
  return (
    <>
      <div data-view="desktop" className="contents max-lg:hidden">
        <CertGrantView options={options} staffChannel={staffChannel} />
      </div>
      <div data-view="mobile" className="contents lg:hidden">
        <CertGrantMobileView options={options} staffChannel={staffChannel} />
      </div>
    </>
  );
}
