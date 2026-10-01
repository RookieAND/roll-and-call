export function quizHintText({ quizError, answer }: { quizError: string | null; answer: string }) {
  if (quizError) return "답을 고친 뒤 다시 신청해 주세요";
  if (answer.trim()) return "";
  return "답을 적으면 신청할 수 있습니다";
}
