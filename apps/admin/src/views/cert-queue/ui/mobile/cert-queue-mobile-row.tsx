import { HStack, Text } from "@roll-and-call/ui";

import type { CertQueueRow } from "@/entities/cert";
import { appliedRulebookLabel, RULEBOOK_KIND_LABEL } from "@/entities/rulebook";
import { ListRow, Tag } from "@/shared/ui";

const LONG_WAIT_DAYS = 5;

interface CertQueueMobileRowProps {
  row: CertQueueRow;
  path: string;
}

// 뱃지는 예외(서플리먼트·전자책·재신청·판매처 확인·기본 룰북 심사 후)만 붙이고, 대기 일수를 오른쪽 끝에 크게 둔다.
export function CertQueueMobileRow({ row, path }: CertQueueMobileRowProps) {
  const late = row.waitedDays >= LONG_WAIT_DAYS && !row.waiting;
  const description =
    row.groupCount > 1 || !row.category ? row.nickname : `${row.nickname} · ${row.category}`;
  return (
    <ListRow
      path={path}
      title={appliedRulebookLabel({ rulebook: row.rulebook, groupBookCount: row.groupCount })}
      muted={row.waiting}
      badges={
        <>
          {row.kind === "core" ? null : <Tag>{RULEBOOK_KIND_LABEL[row.kind]}</Tag>}
          {row.format === "ebook" ? <Tag tone="primary">전자책</Tag> : null}
          {row.previousRejectionCount > 0 ? (
            <Tag tone="warning">{`재신청 ${row.previousRejectionCount}회째`}</Tag>
          ) : null}
          {row.sellerUnlisted ? <Tag tone="warning">판매처 확인 필요</Tag> : null}
          {row.waiting ? <Tag>기본 룰북 심사 후</Tag> : null}
        </>
      }
      trailing={
        <HStack align="baseline" gap="025" className="tabular-nums">
          <Text typography="subtitle1" weight="bold" foreground={late ? "danger" : "normal"}>
            {row.waitedDays}
          </Text>
          <Text
            typography="body4"
            weight={late ? "bold" : undefined}
            foreground={late ? "danger" : "muted"}
          >
            일째
          </Text>
        </HStack>
      }
      description={description}
    />
  );
}
