import { findAssignedQuizQuestion } from "./find-assigned-quiz-question";

// 답은 내려보내지 않는다.
export async function getQuizQuestion(input: {
  serverId: string;
  rulebookId: string;
  userId: string;
}) {
  const question = await findAssignedQuizQuestion(input);
  return question ? { id: question.id, question: question.question } : null;
}
