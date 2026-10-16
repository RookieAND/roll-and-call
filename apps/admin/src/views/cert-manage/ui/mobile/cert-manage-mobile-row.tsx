import { CERT_GRANT_METHOD, CERT_MANAGE_STATUS_LABEL, type CertManageRow } from "@/entities/cert";
import { formatDate } from "@/shared/lib";
import { ListRow, Tag } from "@/shared/ui";

const METHOD_LABEL = {
  [CERT_GRANT_METHOD.photo]: "사진 심사",
  [CERT_GRANT_METHOD.staff]: "운영진 부여",
} as const;

interface CertManageMobileRowProps {
  row: CertManageRow;
}

// 줄 전체가 인증 상세로 가는 입구다. 조치는 상세에서 한다.
export function CertManageMobileRow({ row }: CertManageMobileRowProps) {
  const status = CERT_MANAGE_STATUS_LABEL[row.status];
  return (
    <ListRow
      path={`/cert/manage/${encodeURIComponent(row.key)}`}
      title={row.rulebook}
      badges={
        <>
          {row.sanctioned ? <Tag tone="danger">제재 중</Tag> : null}
          {row.editionEligible === false ? <Tag>일부 인증</Tag> : null}
        </>
      }
      trailing={<Tag tone={status.tone}>{status.label}</Tag>}
      description={`${row.nickname} · ${row.edition}`}
      meta={`${METHOD_LABEL[row.method]} · ${formatDate(row.changedAt)}`}
    />
  );
}
