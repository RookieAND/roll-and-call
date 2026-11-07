import type { RulebookKind } from "#db/schema";

import type { RulebookFields } from "./rulebook-fields";

// 자작 룰은 승인 뒤 이름·판본·분류·종류·인증 정책·구판 연결·포함 서플리먼트를 아무도 바꾸지 않는다. 다른 이름(별칭)만 고친다.
export function changesLockedHomebrewField({
  current,
  fields,
}: {
  current: {
    name: string;
    edition: string;
    category: string;
    kind: RulebookKind;
    supersedesId: string | null;
    certRequired: boolean;
  };
  fields: RulebookFields;
}) {
  return (
    fields.name !== current.name ||
    fields.edition !== current.edition ||
    fields.category !== current.category ||
    fields.kind !== current.kind ||
    fields.supersedesId !== current.supersedesId ||
    fields.certRequired !== current.certRequired ||
    fields.includedSupplementIds.length > 0
  );
}
