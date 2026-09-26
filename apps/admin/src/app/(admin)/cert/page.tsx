import type { Metadata } from "next";

import { CERT_QUEUE_FILTERS, listCertQueue, type CertQueueFilterKey } from "@/shared/server";
import { CertQueueView } from "@/views/cert-queue";

export const metadata: Metadata = { title: "룰북 인증" };

export default async function CertQueuePage({ searchParams }: PageProps<"/cert">) {
  const { q, rulebook, filter, page } = (await searchParams) as Record<string, string | undefined>;
  const known = filter && filter in CERT_QUEUE_FILTERS ? (filter as CertQueueFilterKey) : undefined;
  const queue = await listCertQueue({ query: q, rulebook, filter: known });
  return <CertQueueView queue={queue} page={page} query={{ q, rulebook, filter: known }} />;
}
