import { isString } from "es-toolkit";
import type { Metadata } from "next";

import { listCertQueue, parseCertQueueFilter } from "@/shared/server";
import { CertQueueView } from "@/views/cert-queue";

export const metadata: Metadata = { title: "룰북 인증" };

export default async function CertQueuePage({ searchParams }: PageProps<"/[server]/cert">) {
  const params = await searchParams;
  const filter = parseCertQueueFilter(params);
  const queue = await listCertQueue(filter);
  return (
    <CertQueueView
      queue={queue}
      page={isString(params.page) ? params.page : undefined}
      pageSizeParam={isString(params.pageSize) ? params.pageSize : undefined}
      filter={filter}
    />
  );
}
