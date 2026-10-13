import {
  addedChanges,
  compactChanges,
  listChange,
  scalarChange,
} from "#/modules/moderation/model/audit-changes";

interface QuizQuestionValues {
  question: string;
  answers: string[];
  page: string;
  active: boolean;
}

const activeLabel = (active: boolean) => (active ? "사용 중" : "비활성");

// before가 없으면 새 문항이라 값이 있는 칸을 모두 추가로 남긴다.
export function quizChanges(before: QuizQuestionValues | undefined, after: QuizQuestionValues) {
  if (!before) {
    return [
      ...addedChanges([
        ["문항", after.question],
        ["쪽수", after.page],
        ["사용 여부", activeLabel(after.active)],
      ]),
      ...compactChanges([listChange("보기", [], after.answers)]),
    ];
  }
  return compactChanges([
    scalarChange("문항", before.question, after.question),
    scalarChange("쪽수", before.page, after.page),
    listChange("보기", before.answers, after.answers),
    scalarChange("사용 여부", activeLabel(before.active), activeLabel(after.active)),
  ]);
}
