// 응답자가 없으면 「0명」을 초록이 아니라 중립 색으로 보인다.
export function memberCountTone({
  respondentCount,
  everyone,
}: {
  respondentCount: number;
  everyone: boolean;
}) {
  if (respondentCount === 0) return "normal";
  return everyone ? "success" : "warning";
}
