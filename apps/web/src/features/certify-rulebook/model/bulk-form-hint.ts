interface BulkFormHintInput {
  onQuiz: boolean;
  photoMissing: string | null;
  quizMissing: string | null;
  hasQuizError: boolean;
}

// 신청 버튼 위에 한 줄로 알리는, 지금 단계에서 아직 못 채운 것.
export function bulkFormHint({
  onQuiz,
  photoMissing,
  quizMissing,
  hasQuizError,
}: BulkFormHintInput) {
  if (!onQuiz) return photoMissing;
  return hasQuizError ? "답을 고친 뒤 다시 신청해 주세요" : quizMissing;
}
