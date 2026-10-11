import { QUIZ_ANSWER_FIELD } from "./quiz-answer-field";

// 묶음 신청은 퀴즈가 여러 개라서, 어느 책의 답이 틀렸는지 필드 이름에 책 id를 붙여 돌려준다.
export function bulkQuizAnswerField(rulebookId: string) {
  return `${QUIZ_ANSWER_FIELD}:${rulebookId}`;
}

export function bulkQuizFieldRulebookId(field: string | undefined) {
  const prefix = `${QUIZ_ANSWER_FIELD}:`;
  return field?.startsWith(prefix) ? field.slice(prefix.length) : null;
}
