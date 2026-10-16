import { Tag } from "@/shared/ui";

interface ShotStatusTagProps {
  checked: boolean;
  flagged: boolean;
  rejecting: boolean;
}

export function ShotStatusTag({ checked, flagged, rejecting }: ShotStatusTagProps) {
  if (flagged) return <Tag tone="danger">문제 있음</Tag>;
  if (rejecting) return <Tag>지정 전</Tag>;
  return checked ? <Tag tone="success">확인</Tag> : <Tag>확인 전</Tag>;
}
