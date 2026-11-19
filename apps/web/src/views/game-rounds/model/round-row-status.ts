import { ROUND_ROW_KIND, type RoundRowKind } from "./round-row-kind";

type BadgePalette = "success" | "primary" | "gray" | "warning";

// 줄 오른쪽 상태 Badge. 묶음 줄(later)은 상태가 아니라 안내라서 Badge가 없다.
export const ROUND_ROW_STATUS: Record<
  RoundRowKind,
  { label: string; palette: BadgePalette } | null
> = {
  [ROUND_ROW_KIND.finished]: { label: "끝남", palette: "success" },
  [ROUND_ROW_KIND.inProgress]: { label: "진행 중", palette: "primary" },
  [ROUND_ROW_KIND.scheduled]: { label: "일정 정해짐", palette: "gray" },
  [ROUND_ROW_KIND.coordinating]: { label: "조율 중", palette: "primary" },
  [ROUND_ROW_KIND.unscheduled]: { label: "일정 없음", palette: "gray" },
  [ROUND_ROW_KIND.later]: null,
  [ROUND_ROW_KIND.cancelling]: { label: "취소 중", palette: "warning" },
};
