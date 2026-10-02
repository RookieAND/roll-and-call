import type { RulebookDraft } from "./rulebook-draft";

// 포함하는 구판 연결을 풀거나 인증 정책을 불필요에서 필요로 바꾸면 저장 전에 영향을 확인받는다.
export function needsImpactCheck({ saved, next }: { saved: RulebookDraft; next: RulebookDraft }) {
  const nextSupersedesId = next.kind === "core" ? next.supersedesId : null;
  const unlinks = Boolean(saved.supersedesId) && nextSupersedesId !== saved.supersedesId;
  const requires = !saved.certRequired && next.certRequired;
  return unlinks || requires;
}
