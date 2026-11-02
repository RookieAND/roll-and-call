export const APPLICATION_QUESTION_MAX_LENGTH = 50;

export const APPLICATION_QUESTION_DEFAULT = "신청 전, GM에게 하고 싶은 말을 적어 주세요.";

// 신청글 받기 구인의 질문. 비웠거나 기본 문구 그대로면 null로 저장한다.
export function normalizeApplicationQuestion(question: string | undefined | null): string | null {
  const trimmed = question?.trim() ?? "";
  if (trimmed.length === 0 || trimmed === APPLICATION_QUESTION_DEFAULT) return null;
  return trimmed;
}
