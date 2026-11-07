const DONE_VERB = { approve: "승인했습니다", reject: "반려했습니다" } as const;

// 처리 뒤 대기열에서 띄우는 토스트. 판본은 넣지 않는다.
export function homebrewDoneText({
  name,
  decision,
}: {
  name: string;
  decision: keyof typeof DONE_VERB;
}) {
  return `${name} 자작 룰을 ${DONE_VERB[decision]}`;
}
