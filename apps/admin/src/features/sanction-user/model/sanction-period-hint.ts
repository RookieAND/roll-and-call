import { formatDate } from "@/shared/lib";

const RESTRICTION = "제재 중에는 참가 신청과 대기 신청, 구인 개설을 모두 할 수 없습니다.";

export function sanctionPeriodHint({
  validDays,
  end,
  now,
}: {
  validDays: boolean;
  end: string | null;
  now: Date;
}) {
  if (!validDays) return "1일 이상의 일수를 입력해 주세요.";
  if (end) return `오늘(${formatDate(now)}) 확정하면 ${end}까지 적용됩니다. ${RESTRICTION}`;
  return `해제하기 전까지 적용됩니다. ${RESTRICTION}`;
}
