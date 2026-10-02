import { Tag } from "@/shared/ui";

interface NoShowBadgeProps {
  cancelled: boolean;
}

export function NoShowBadge({ cancelled }: NoShowBadgeProps) {
  if (cancelled) return <Tag>불참 취소됨</Tag>;
  return <Tag>불참</Tag>;
}
