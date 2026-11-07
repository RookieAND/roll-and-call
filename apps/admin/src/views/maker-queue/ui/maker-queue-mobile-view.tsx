import { CertRouteTabs, type CertTabCountKey } from "@/entities/cert";
import type { listHomebrewQueue } from "@/entities/homebrew/server";
import { formatFullDateTime } from "@/shared/lib";
import { AdminHeader, EMPTY_IMAGE, EmptyState, InfiniteList, ListRow } from "@/shared/ui";

interface MakerQueueMobileViewProps {
  rows: Awaited<ReturnType<typeof listHomebrewQueue>>;
  tabCounts: Record<CertTabCountKey, number>;
}

export function MakerQueueMobileView({ rows, tabCounts }: MakerQueueMobileViewProps) {
  return (
    <>
      <AdminHeader title="룰북 인증" />
      <CertRouteTabs value="/cert/maker" counts={tabCounts} />
      {rows.length === 0 ? (
        <EmptyState
          image={EMPTY_IMAGE.myGames}
          title="심사할 자작 룰이 없습니다"
          description="새 신청이 들어오면 이 표에 쌓입니다."
          className="h-90"
        />
      ) : (
        <InfiniteList>
          {rows.map((row) => (
            <ListRow
              key={row.id}
              path={`/cert/maker/${row.id}`}
              title={row.name}
              trailing={row.edition || undefined}
              description={row.applicantNickname}
              meta={formatFullDateTime(row.appliedAt)}
            />
          ))}
        </InfiniteList>
      )}
    </>
  );
}
