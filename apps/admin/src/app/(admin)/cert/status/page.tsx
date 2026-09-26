import type { Metadata } from "next";

import { getCertStatus } from "@/shared/server";
import {
  CERT_STATUS_TAB,
  CertStatusView,
  GM_CERT_VIEW,
  type GmCertView,
} from "@/views/cert-status";

export const metadata: Metadata = { title: "룰북 인증 현황" };

export default async function CertStatusPage({ searchParams }: PageProps<"/cert/status">) {
  const { tab, all, view, q, page } = (await searchParams) as Record<string, string | undefined>;
  const status = await getCertStatus();
  const gmView: GmCertView =
    Object.values(GM_CERT_VIEW).find((candidate) => candidate === view) ?? GM_CERT_VIEW.todo;
  return (
    <CertStatusView
      status={status}
      tab={tab === CERT_STATUS_TAB.gm ? CERT_STATUS_TAB.gm : CERT_STATUS_TAB.rulebook}
      allEditions={all === "1"}
      gmView={gmView}
      query={q}
      page={page}
    />
  );
}
