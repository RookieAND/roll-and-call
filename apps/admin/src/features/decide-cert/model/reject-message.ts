// 사용자에게 보이는 사유의 끝에 문제 사진 꼬리 문장을 붙이거나 뗀다. 운영진이 고친 앞부분은 그대로 둔다.
// 사유를 고를 때는 text에 그 사유의 미리 채울 문장, previousShots에 빈 배열을 넘긴다.
export function rejectMessage({
  text,
  previousShots,
  shots,
}: {
  text: string;
  previousShots: string[];
  shots: string[];
}) {
  const tailOf = (labels: string[]) =>
    labels.length ? `${labels.join("·")} 사진을 다시 찍어 올려 주세요.` : "";
  const previousTail = tailOf(previousShots);
  const base =
    previousTail && text.endsWith(previousTail)
      ? text.slice(0, -previousTail.length).trimEnd()
      : text;
  return [base, tailOf(shots)].filter(Boolean).join(" ");
}
