import type { Metadata } from "next";

import {
  CERT_QUEUE_FILTERS,
  getCurrentServer,
  listCertQueue,
  type CertQueueFilterKey,
} from "@/shared/server";
import { CertQueueView } from "@/views/cert-queue";

export const metadata: Metadata = { title: "룰북 인증" };

export default async function CertQueuePage({ searchParams }: PageProps<"/[server]/cert">) {
  const { q, rulebook, filter, page } = (await searchParams) as Record<string, string | undefined>;
  const known = filter && filter in CERT_QUEUE_FILTERS ? (filter as CertQueueFilterKey) : undefined;
  const [queue, server] = await Promise.all([
    listCertQueue({ query: q, rulebook, filter: known }),
    getCurrentServer(),
  ]);
  return (
    <CertQueueView
      queue={queue}
      serverName={server.name}
      page={page}
      query={{ q, rulebook, filter: known }}
    />
  );
}
