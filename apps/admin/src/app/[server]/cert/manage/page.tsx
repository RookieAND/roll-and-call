import type { Metadata } from "next";

import { parseSort, stringParams } from "@/shared/lib";
import {
  CERT_MANAGE_SORT_COLUMNS,
  CERT_MANAGE_SORT_FALLBACK,
  getCurrentServer,
  getRevokeTarget,
  listCertManage,
  parseCertManageFilter,
} from "@/shared/server";
import { CERT_ROW_ACTION, CertManageView } from "@/views/cert-manage";

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
    <CertManageView
      list={list}
      filter={filter}
      sort={sort}
      query={query}
      revokeTarget={revokeTarget}
      staffChannel={Boolean(server.staffChannelId)}
    />
  );
}
