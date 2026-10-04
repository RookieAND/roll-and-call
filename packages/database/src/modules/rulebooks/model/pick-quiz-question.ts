// 같은 사람·같은 책·같은 반려 횟수면 늘 같은 문항을 낸다. 문항 목록이 바뀌면 다른 문항이 될 수 있다.
// questions는 사용 중 문항을 id 오름차순으로 받는다.
export function pickQuizQuestion<Question>({
  questions,
  userId,
  rulebookId,
  rejectedCount,
}: {
  questions: Question[];
  userId: string;
  rulebookId: string;
  rejectedCount: number;
}): Question | null {
  if (questions.length === 0) return null;
  let hash = 0x811c9dc5;
  for (const character of `${userId}:${rulebookId}:${rejectedCount}`) {
    hash ^= character.charCodeAt(0);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return questions[hash % questions.length]!;
}
