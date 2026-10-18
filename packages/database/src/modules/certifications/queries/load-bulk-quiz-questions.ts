import { findAssignedQuizQuestions } from "#db/modules/rulebooks";

import { pickBulkQuizBooks } from "../model/pick-bulk-quiz-books";

// 여러 권을 한 번에 신청할 때 실제로 내는 퀴즈를 돌려준다(최대 3권, 책을 고르는 규칙은 pickBulkQuizBooks).
// 출제 화면과 제출 검사가 같은 결과를 쓰도록 둘 다 이 함수를 쓴다. 정답(answers)이 들어 있으므로 화면에 넘기기 전에 덜어낸다.
export async function loadBulkQuizQuestions({
  serverId,
  userId,
  rulebookIds,
}: {
  serverId: string;
  userId: string;
  rulebookIds: string[];
}) {
  const assigned = await findAssignedQuizQuestions({ serverId, userId, rulebookIds });
  const quizBookIds = rulebookIds.filter((rulebookId) => assigned.has(rulebookId));
  return pickBulkQuizBooks({ userId, quizBookIds }).map((rulebookId) => assigned.get(rulebookId)!);
}
