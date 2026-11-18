import { recruitPostStatus } from "./recruit-post-status";

const TITLE_MAX_LENGTH = 100;

// 포럼 글 제목: "(상태) [룰] 제목 [GM 이름]". 취소·마감일 때만 맨 앞에 상태를 붙이고, 룰 분류가 없으면 "[룰] "을 뺀다.
// 100자를 넘으면 제목을 줄여 룰과 GM 표시가 남게 한다.
export function recruitPostTitle({
  title,
  gmName,
  ruleLabel = null,
  cancelled = false,
  closed = false,
}: {
  title: string;
  gmName: string;
  ruleLabel?: string | null;
  cancelled?: boolean;
  closed?: boolean;
}) {
  const status = recruitPostStatus({ cancelled, closed });
  const prefix = `${status}${ruleLabel ? `[${ruleLabel}] ` : ""}`;
  const suffix = ` [GM ${gmName}]`;
  const room = Math.max(TITLE_MAX_LENGTH - prefix.length - suffix.length, 0);
  return `${prefix}${title.trim().slice(0, room)}${suffix}`;
}
