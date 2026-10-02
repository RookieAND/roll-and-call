import { formatDate } from "@/shared/lib";

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
  const until = end ? `${end}까지` : "해제하기 전까지";
  return `오늘(${formatDate(now)}) 확정하면 ${until} 적용되며, 그동안 모든 활동이 제한됩니다.`;
}
