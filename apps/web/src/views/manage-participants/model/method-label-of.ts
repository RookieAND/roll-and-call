import { RECRUIT_METHOD, recruitMethodLabel, type RecruitMethod } from "@/entities/game";

export function methodLabelOf({
  recruitMethod,
  drawnAt,
  selectionFinishedAt,
}: {
  recruitMethod: RecruitMethod;
  drawnAt: Date | null;
  selectionFinishedAt: Date | null;
}): string {
  if (recruitMethod === RECRUIT_METHOD.lottery && drawnAt) return "추첨 완료";
  if (recruitMethod === RECRUIT_METHOD.selection && selectionFinishedAt) return "선발 완료";
  return recruitMethodLabel(recruitMethod);
}
