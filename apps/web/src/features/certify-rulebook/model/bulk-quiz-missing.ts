interface BulkQuizMissingInput {
  rulebookIds: readonly string[];
  answers: Readonly<Record<string, string>>;
}

export function bulkQuizMissing({ rulebookIds, answers }: BulkQuizMissingInput) {
  const blank = rulebookIds.some((rulebookId) => !answers[rulebookId]?.trim());
  return blank ? "모든 퀴즈의 답을 적어야 합니다" : null;
}
