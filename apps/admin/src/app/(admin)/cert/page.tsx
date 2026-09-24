import type { Metadata } from "next";

import { listCertQueue } from "@/shared/server";
import { CertQueueView } from "@/views/cert-queue";

export const metadata: Metadata = { title: "룰북 인증" };

export default async function CertQueuePage({ searchParams }: PageProps<"/cert">) {
  const { q, rulebook, reapplied } = (await searchParams) as Record<string, string | undefined>;
  const queue = await listCertQueue({ query: q, rulebook, reappliedOnly: reapplied === "1" });
  return <CertQueueView queue={queue} query={{ q, rulebook, reapplied }} />;
}
