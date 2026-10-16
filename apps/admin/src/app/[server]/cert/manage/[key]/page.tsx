import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { getCertManageRow, getRevokeTarget } from "@/entities/cert/server";
import { getCurrentServer } from "@/shared/server";
import { CERT_ROW_ACTION, CertDetailMobileView } from "@/views/cert-manage";

export const metadata: Metadata = { title: "인증 상세" };

// 모바일 전용 화면이다. 데스크톱은 목록의 ⋯ 메뉴에서 같은 조치를 한다.
export default async function CertDetailPage({
  params,
  searchParams,
}: PageProps<"/[server]/cert/manage/[key]">) {
  const [{ key }, { action }] = await Promise.all([params, searchParams]);
  const row = await getCertManageRow(decodeURIComponent(key));
  if (!row) notFound();
  const [server, revokeTarget] = await Promise.all([
    getCurrentServer(),
    action === CERT_ROW_ACTION.revoke
      ? getRevokeTarget({ userId: row.userId, rulebookId: row.rulebookId })
      : null,
  ]);
  return (
    <div data-view="mobile" className="contents lg:hidden">
      <CertDetailMobileView
        row={row}
        revokeTarget={revokeTarget}
        staffChannel={Boolean(server.staffChannelId)}
      />
    </div>
  );
}
