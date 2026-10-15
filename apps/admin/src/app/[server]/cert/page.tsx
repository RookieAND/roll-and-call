import { isString } from "es-toolkit";
import type { Metadata } from "next";

import { parseCertQueueFilter } from "@/entities/cert";
import { listCertQueue } from "@/entities/cert/server";
import { CertQueueMobileView, CertQueueView } from "@/views/cert-queue";

export const metadata: Metadata = { title: "룰북 인증" };

export default async function CertQueuePage({ searchParams }: PageProps<"/[server]/cert">) {
  const params = await searchParams;
  const filter = parseCertQueueFilter(params);
  const queue = await listCertQueue(filter);
  return (
    <>
      <div className="contents max-lg:hidden">
        <CertQueueView
          queue={queue}
          page={isString(params.page) ? params.page : undefined}
          pageSizeParam={isString(params.pageSize) ? params.pageSize : undefined}
          filter={filter}
        />
      </div>
      <div className="contents lg:hidden">
        <CertQueueMobileView queue={queue} filter={filter} />
      </div>
    </>
  );
}
