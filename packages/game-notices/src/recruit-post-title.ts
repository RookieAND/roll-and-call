const TITLE_MAX_LENGTH = 100;

// 포럼 글 제목: "제목 [GM 이름]". 100자를 넘으면 제목을 줄여 GM 표시가 남게 한다.
export function recruitPostTitle({
  title,
  gmName,
  cancelled = false,
}: {
  title: string;
  gmName: string;
  cancelled?: boolean;
}) {
  const suffix = ` [GM ${gmName}]${cancelled ? " (취소됨)" : ""}`;
  return `${title.trim().slice(0, TITLE_MAX_LENGTH - suffix.length)}${suffix}`;
}
