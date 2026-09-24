import { Skeleton } from "@roll-and-call/ui";

export type SkeletonCellKind =
  | "text"
  | "badge"
  | "button"
  | "icon"
  | "number"
  | "date"
  | "bar"
  | "empty";

const TEXT_WIDTHS = ["72%", "56%", "84%", "64%", "78%", "48%", "68%", "60%", "74%", "52%"];

interface SkeletonCellProps {
  kind: SkeletonCellKind;
  row: number;
}

// 표 한 칸의 뼈대. 행마다 글자 폭을 조금씩 달리해 실제 목록처럼 보이게 한다.
export function SkeletonCell({ kind, row }: SkeletonCellProps) {
  if (kind === "empty") return null;
  if (kind === "badge") return <Skeleton width={56} height={22} rounded="full" />;
  if (kind === "button") return <Skeleton width={64} height={28} rounded={400} />;
  if (kind === "icon") return <Skeleton width={28} height={28} rounded={400} />;
  if (kind === "number") return <Skeleton width={28} height={14} />;
  if (kind === "date") return <Skeleton width={row % 2 ? 84 : 96} height={14} />;
  if (kind === "bar") return <Skeleton width="100%" height={8} rounded="full" />;
  return <Skeleton width={TEXT_WIDTHS[row % TEXT_WIDTHS.length]} height={14} />;
}
