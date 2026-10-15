import type { RulebookKind } from "@roll-and-call/database";
import { RULEBOOK_KIND } from "@roll-and-call/database/rulebooks/model";
import { Button, Text, VStack } from "@roll-and-call/ui";

import type { CertifiedGm } from "@/entities/rulebook/server";
import { formatDate, sortRows, withQuery, type TableSort } from "@/shared/lib";
import { EMPTY_IMAGE, EmptyState, InfiniteRows, ListRow, ServerLink } from "@/shared/ui";

import type { CertifiedGmSortColumn } from "../../model/certified-gm-sort";

interface CertifiedGmRowsProps {
  rulebookId: string;
  kind: RulebookKind;
  gms: CertifiedGm[];
  certRequired: boolean;
  sort: TableSort<CertifiedGmSortColumn>;
}

export function CertifiedGmRows({
  rulebookId,
  kind,
  gms,
  certRequired,
  sort,
}: CertifiedGmRowsProps) {
  const sorted = sortRows({
    rows: gms,
    sort,
    accessors: { approved: (gm) => gm.approvedAt, sessions: (gm) => gm.recentSessionCount },
  });
  const title = kind === RULEBOOK_KIND.core ? "이 룰북으로 인증된 GM" : "인증한 사람";
  return (
    <>
      <VStack
        gap="075"
        className="border-b border-(--rc-color-border-subtle) bg-surface px-200 py-150"
      >
        <Text typography="body3" weight="bold">
          {title}
        </Text>
        {certRequired ? (
          <Button
            variant="outline"
            size="lg"
            render={<ServerLink path={withQuery("/cert/manage", {}, { rulebook: rulebookId })} />}
          >
            인증 관리에서 보기
          </Button>
        ) : (
          <Text typography="body4" foreground="hint">
            인증이 필요 없는 룰북이므로 인증을 부여하지 않아도 됩니다
          </Text>
        )}
      </VStack>
      {gms.length === 0 ? (
        <EmptyState
          image={EMPTY_IMAGE.myGames}
          title="이 룰북으로 인증된 GM이 없습니다"
          description={
            certRequired
              ? "GM의 인증 신청이 승인되거나 운영진이 인증을 부여하면 이곳에 표시됩니다."
              : "인증이 필요 없는 룰북이므로 누구나 이 룰북으로 구인을 열 수 있습니다."
          }
        />
      ) : (
        <InfiniteRows
          unit="명"
          rows={sorted.map((gm) => (
            <ListRow
              key={gm.userId}
              path={`/users/${gm.userId}`}
              title={gm.nickname}
              trailing={`최근 90일 ${gm.recentSessionCount}회`}
              description={`${formatDate(gm.approvedAt)} 인증`}
            />
          ))}
        />
      )}
    </>
  );
}
