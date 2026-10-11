import { BULK_CERT_MAX_QUIZ_BOOKS } from "./bulk-cert-limits";

function hashOf(text: string) {
  let hash = 0x811c9dc5;
  for (const character of text) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return hash;
}

// 여러 권을 한 번에 신청할 때 퀴즈를 낼 책을 최대 3권 고른다. 신청자가 쉬운 책을 고르지 못하도록 서버가 정한다.
// 같은 사람이 같은 책 묶음으로 다시 열면 늘 같은 책이 나온다(출제 화면과 제출 검사가 같은 결과를 쓰도록).
// quizBookIds는 퀴즈 문항이 있는 책의 id이고, 결과는 받은 순서를 지킨다.
export function pickBulkQuizBooks({
  userId,
  quizBookIds,
}: {
  userId: string;
  quizBookIds: string[];
}): string[] {
  if (quizBookIds.length <= BULK_CERT_MAX_QUIZ_BOOKS) return quizBookIds;
  const batchKey = `${userId}:${quizBookIds.toSorted().join(",")}`;
  const picked = new Set(
    quizBookIds
      .map((id) => ({ id, score: hashOf(`${batchKey}:${id}`) }))
      .toSorted((left, right) => left.score - right.score || left.id.localeCompare(right.id))
      .slice(0, BULK_CERT_MAX_QUIZ_BOOKS)
      .map(({ id }) => id),
  );
  return quizBookIds.filter((id) => picked.has(id));
}
