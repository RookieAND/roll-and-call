const TITLE_MAX_LENGTH = 100;

// 포럼 글 제목: "[룰] 제목 [GM 이름]". 룰 분류가 없으면 "[룰] "을 뺀다.
// 100자를 넘으면 제목을 줄여 룰과 GM 표시가 남게 한다.
export function recruitPostTitle({
  title,
  gmName,
  ruleLabel = null,
  cancelled = false,
}: {
  title: string;
  gmName: string;
  ruleLabel?: string | null;
  cancelled?: boolean;
}) {
  const prefix = ruleLabel ? `[${ruleLabel}] ` : "";
  const suffix = ` [GM ${gmName}]${cancelled ? " (취소됨)" : ""}`;
  const room = Math.max(TITLE_MAX_LENGTH - prefix.length - suffix.length, 0);
  return `${prefix}${title.trim().slice(0, room)}${suffix}`;
}
