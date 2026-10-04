import { isUndefined } from "es-toolkit";

type PastScheduleError = { error: string; field: "endDate" | "confirmedAt" };

// 넘긴 값만 본다. 수정은 바뀐 값만 넘겨 마감 지난 구인의 소개만 고치는 저장을 받는다.
export function pastScheduleError(
  { endDate, confirmedAt }: { endDate?: Date; confirmedAt?: Date },
  now: Date = new Date(),
): PastScheduleError | null {
  if (!isUndefined(endDate) && endDate.getTime() < now.getTime()) {
    return { error: "모집 마감은 지금 이후로 정해 주세요.", field: "endDate" };
  }
  if (!isUndefined(confirmedAt) && confirmedAt.getTime() < now.getTime()) {
    return { error: "세션 일시는 지금 이후로 정해 주세요.", field: "confirmedAt" };
  }
  return null;
}
