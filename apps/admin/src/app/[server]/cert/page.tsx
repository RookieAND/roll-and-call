import { isString } from "es-toolkit";
import type { Metadata } from "next";

import { getCurrentServer, listCertQueue, parseCertQueueFilter } from "@/shared/server";
import { CertQueueView } from "@/views/cert-queue";

export const metadata: Metadata = { title: "룰북 인증" };

export default async function CertQueuePage({ searchParams }: PageProps<"/[server]/cert">) {
  const params = await searchParams;
  const filter = parseCertQueueFilter(params);
  const [queue, server] = await Promise.all([listCertQueue(filter), getCurrentServer()]);
  return (
    <CertQueueView
      queue={queue}
      serverName={server.name}
      page={isString(params.page) ? params.page : undefined}
      filter={filter}
    />
  );
}
