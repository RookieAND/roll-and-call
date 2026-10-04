import type { Metadata } from "next";

import { getCurrentServer, getGrantOptions, requireStaff } from "@/shared/server";
import { CertGrantView } from "@/views/cert-grant";

export const metadata: Metadata = { title: "인증 부여" };

export default async function CertGrantPage() {
  const [options, server] = await Promise.all([
    getGrantOptions(),
    getCurrentServer(),
    requireStaff(),
  ]);
  return <CertGrantView options={options} staffChannel={Boolean(server.staffChannelId)} />;
}
