import { addedChanges, compactChanges, listChange, scalarChange } from "#db/modules/audit";
import type { RulebookDescription } from "#db/modules/rulebooks/model/rulebook-description";
import type { AuditChange } from "#db/schema/moderation";

import { certPolicyLabel } from "./cert-policy-label";

const KIND_LABEL = {
  core: "기본 룰북",
  supplement: "서플리먼트",
  handbook: "핸드북",
} as const;

const miniRuleLabel = (miniRule: boolean) => (miniRule ? "켜짐" : "꺼짐");

// 활동 기록에 남기는 칸 이름은 어드민 룰북 화면의 입력 이름과 같다.
// before가 null이면 새로 만든 룰북이라 값이 있는 칸을 모두 추가로 남긴다.
export function rulebookChanges(
  before: RulebookDescription | null,
  after: RulebookDescription,
): AuditChange[] {
  if (!before) {
    return [
      ...addedChanges([
        ["이름", after.name],
        ["판본", after.edition],
        ["분류", after.category],
        ["분류 약어", after.categoryAlias],
        ["종류", KIND_LABEL[after.kind]],
        ["포함하는 구판", after.supersedes],
        ["인증", certPolicyLabel(after.certRequired)],
      ]),
      ...compactChanges([
        listChange("포함하는 서플리먼트", [], after.includedSupplements),
        listChange("다른 이름", [], after.aliases),
      ]),
    ];
  }
  return compactChanges([
    scalarChange("이름", before.name, after.name),
    scalarChange("판본", before.edition, after.edition),
    scalarChange("분류", before.category, after.category),
    scalarChange("분류 약어", before.categoryAlias, after.categoryAlias),
    scalarChange("미니룰", miniRuleLabel(before.miniRule), miniRuleLabel(after.miniRule)),
    scalarChange("종류", KIND_LABEL[before.kind], KIND_LABEL[after.kind]),
    scalarChange("포함하는 구판", before.supersedes, after.supersedes),
    listChange("포함하는 서플리먼트", before.includedSupplements, after.includedSupplements),
    listChange("다른 이름", before.aliases, after.aliases),
    scalarChange("인증", certPolicyLabel(before.certRequired), certPolicyLabel(after.certRequired)),
  ]);
}
