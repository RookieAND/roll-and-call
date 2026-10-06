// 줄 단위로 limit 안에 들게 나눈다. 한 줄이 limit보다 길면 그 줄만 글자 수로 자른다.
export function splitMessage({ text, limit }: { text: string; limit: number }): string[] {
  const chunks: string[] = [];
  let current = "";
  for (const line of text.split("\n")) {
    const pieces =
      line.length > limit ? (line.match(new RegExp(`.{1,${limit}}`, "gs")) ?? []) : [line];
    for (const piece of pieces) {
      const joined = current ? `${current}\n${piece}` : piece;
      if (joined.length <= limit) {
        current = joined;
      } else {
        if (current) chunks.push(current);
        current = piece;
      }
    }
  }
  if (current) chunks.push(current);
  return chunks;
}
