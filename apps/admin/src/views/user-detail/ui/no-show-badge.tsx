import { Badge } from "@roll-and-call/ui";

export function NoShowBadge({ cancelled }: { cancelled: boolean }) {
  if (cancelled) return <Badge colorPalette="gray">불참 취소됨</Badge>;
  return <Badge colorPalette="danger">불참</Badge>;
}
