import type { Metadata } from "next";

import { getCertStatus } from "@/shared/server";
import { CERT_STATUS_TAB, CertStatusView } from "@/views/cert-status";

export const metadata: Metadata = { title: "룰북 인증 현황" };

export default async function CertStatusPage({ searchParams }: PageProps<"/cert/status">) {
  const { tab, scope, unapplied } = (await searchParams) as Record<string, string | undefined>;
  const allTime = scope === "all";
  const status = await getCertStatus({ allTime });
  return (
    <CertStatusView
      status={status}
      tab={tab === CERT_STATUS_TAB.gm ? CERT_STATUS_TAB.gm : CERT_STATUS_TAB.rulebook}
      allTime={allTime}
      unappliedOnly={unapplied === "1"}
    />
  );
}
