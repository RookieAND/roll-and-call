import { BULK_CERT_MAX_BOOKS } from "@roll-and-call/database/certifications/model";

import { CERT_OPTION, certOption, type MyRulebook } from "@/entities/rulebook";

interface BulkSelectionInput {
  rulebooks: readonly MyRulebook[];
  selectedIds: readonly string[];
}

interface BulkSelectableInput extends BulkSelectionInput {
  rulebook: MyRulebook;
}

interface BulkToggleInput extends BulkSelectionInput {
  rulebookId: string;
}

// 서플리먼트는 같은 판본의 기본 룰북이 인증됐거나 이번 묶음에 함께 들어 있을 때만 고를 수 있다.
export function isBulkSelectable({ rulebook, rulebooks, selectedIds }: BulkSelectableInput) {
  const option = certOption({ rulebook, rulebooks: [...rulebooks] });
  if (option.type === CERT_OPTION.pick) return true;
  return (
    option.type === CERT_OPTION.needsCore &&
    option.missing.every((core) => selectedIds.includes(core.id))
  );
}

// 기본 룰북을 뺐을 때 조건을 잃은 서플리먼트를 선택에서 함께 뺀다.
export function pruneBulkSelection({ rulebooks, selectedIds }: BulkSelectionInput): string[] {
  return selectedIds.filter((id) => {
    const rulebook = rulebooks.find((candidate) => candidate.id === id);
    return rulebook ? isBulkSelectable({ rulebook, rulebooks, selectedIds }) : false;
  });
}

export function toggleBulkSelection({
  rulebooks,
  selectedIds,
  rulebookId,
}: BulkToggleInput): string[] {
  if (selectedIds.includes(rulebookId)) {
    return pruneBulkSelection({
      rulebooks,
      selectedIds: selectedIds.filter((id) => id !== rulebookId),
    });
  }
  return selectedIds.length >= BULK_CERT_MAX_BOOKS
    ? [...selectedIds]
    : [...selectedIds, rulebookId];
}
