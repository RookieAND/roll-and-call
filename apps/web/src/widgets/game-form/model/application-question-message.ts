import { APPLICATION_QUESTION_MAX_LENGTH } from "@roll-and-call/database/games/model";

export function applicationQuestionMessage(question: string): string {
  if (question.length >= APPLICATION_QUESTION_MAX_LENGTH) {
    return `${APPLICATION_QUESTION_MAX_LENGTH}자까지 적을 수 있습니다.`;
  }
  if (question.trim().length === 0) return "비워 두면 기본 문구로 저장합니다.";
  return "한 문장으로 적어 주세요. 신청 시트 맨 위에 보입니다.";
}
