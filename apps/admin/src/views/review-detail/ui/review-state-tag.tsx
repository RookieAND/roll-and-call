import { Tag } from "@/shared/ui";

interface ReviewStateTagProps {
  openReportCount: number;
  hidden: boolean;
  held: boolean;
}

// 한 후기에는 상태 뱃지를 하나만 둔다. 신고 → 숨김 중 → 보류 순서로 고른다.
export function ReviewStateTag({ openReportCount, hidden, held }: ReviewStateTagProps) {
  if (openReportCount) return <Tag tone="danger">{`신고 ${openReportCount}건`}</Tag>;
  if (hidden) return <Tag>숨김 중</Tag>;
  if (held) return <Tag>보류</Tag>;
  return null;
}
