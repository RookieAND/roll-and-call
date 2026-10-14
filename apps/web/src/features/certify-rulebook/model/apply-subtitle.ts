import { APPLY_MODE, type ApplyMode } from "./apply-mode";

export function applySubtitle(mode: ApplyMode | null) {
  if (mode === APPLY_MODE.bulk) return "함께 신청할 책을 모두 골라야 합니다.";
  if (mode === APPLY_MODE.single) return "한 권씩 신청합니다.";
  return "신청 방식을 골라야 합니다.";
}
