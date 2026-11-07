import { formatFullDateTime } from "@/shared/lib";
import { ConflictNotice, NextItemButton } from "@/shared/ui";

interface WithdrawnNoticeProps {
  withdrawnAt: Date;
  nextHref?: string;
}

export function WithdrawnNotice({ withdrawnAt, nextHref }: WithdrawnNoticeProps) {
  return (
    <ConflictNotice
      title="신청자가 신청을 거뒀습니다"
      description={`${formatFullDateTime(withdrawnAt)}에 거둔 신청입니다.`}
      actions={<NextItemButton href={nextHref} />}
    />
  );
}
