import type { Metadata } from "next";

import {
  CERT_MANAGE_SORT_COLUMNS,
  CERT_MANAGE_SORT_FALLBACK,
  parseCertManageFilter,
} from "@/entities/cert";
import { getRevokeTarget, listCertManage } from "@/entities/cert/server";
import { parseSort, stringParams } from "@/shared/lib";
import { getCurrentServer } from "@/shared/server";
import { CERT_ROW_ACTION, CertManageMobileView, CertManageView } from "@/views/cert-manage";

export const metadata: Metadata = { title: "인증 관리" };

export default async function CertManagePage({ searchParams }: PageProps<"/[server]/cert/manage">) {
  const query = stringParams(await searchParams);
  const filter = parseCertManageFilter(query);
  const sort = parseSort({
    searchParams: query,
    columns: CERT_MANAGE_SORT_COLUMNS,
    fallback: CERT_MANAGE_SORT_FALLBACK,
  });
  const revoking =
    query.action === CERT_ROW_ACTION.revoke && filter.userId && filter.rulebookId
      ? { userId: filter.userId, rulebookId: filter.rulebookId }
      : null;
  const [list, server, revokeTarget] = await Promise.all([
    listCertManage({ filter, sort }),
    getCurrentServer(),
    revoking ? getRevokeTarget(revoking) : null,
  ]);
  return (
    <>
      <div className="contents max-lg:hidden">
        <CertManageView
          list={list}
          filter={filter}
          sort={sort}
          query={query}
          revokeTarget={revokeTarget}
          staffChannel={Boolean(server.staffChannelId)}
        />
      </div>
      <div className="contents lg:hidden">
        <CertManageMobileView list={list} filter={filter} sort={sort} query={query} />
      </div>
    </>
  );
}
