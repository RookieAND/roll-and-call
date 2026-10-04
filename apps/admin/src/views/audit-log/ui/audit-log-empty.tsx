import { Button } from "@roll-and-call/ui";

import { EMPTY_IMAGE, ServerLink, TableEmptyRow } from "@/shared/ui";

const COLUMN_COUNT = 7;

interface AuditLogEmptyProps {
  periodLimited: boolean;
  allPeriodHref: string;
}

export function AuditLogEmpty({ periodLimited, allPeriodHref }: AuditLogEmptyProps) {
  if (!periodLimited) {
    return (
      <TableEmptyRow
        colSpan={COLUMN_COUNT}
        image={EMPTY_IMAGE.search}
        title="조건에 맞는 활동 기록이 없습니다"
        description="검색어나 조치를 바꿔 보세요."
      />
    );
  }
  return (
    <TableEmptyRow
      colSpan={COLUMN_COUNT}
      image={EMPTY_IMAGE.search}
      title="선택한 기간에 맞는 기록이 없습니다"
      description="기간을 전체로 바꾸면 더 오래된 기록도 볼 수 있습니다."
      action={
        <Button
          variant="outline"
          colorPalette="gray"
          render={<ServerLink path={allPeriodHref} scroll={false} />}
        >
          전체 기간으로 보기
        </Button>
      }
    />
  );
}
