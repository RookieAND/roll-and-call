import { SET_STATUS, setStatus, type EditionSet } from "@/entities/rulebook";

type RulebookSetBadge = { label: string; colorPalette: "success" | "primary" | "gray" };

// 자작 룰은 배지 없이 일반 책과 같은 모양으로 보인다(시안 06 M5).
export function rulebookSetBadgeOf(set: EditionSet): RulebookSetBadge | null {
  if (set.homebrew) return null;
  if (set.earned) return { label: "인증 완료", colorPalette: "success" };
  if (set.free) return { label: "무료 배포", colorPalette: "primary" };
  const { status } = setStatus(set);
  if (status === SET_STATUS.pending) return { label: "심사 중", colorPalette: "gray" };
  if (status === SET_STATUS.rejected) return { label: "반려됨", colorPalette: "gray" };
  return { label: "미인증", colorPalette: "gray" };
}
