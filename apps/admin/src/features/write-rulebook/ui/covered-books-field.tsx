import { Text, VStack } from "@roll-and-call/ui";

import type { DraftCategory } from "../model/draft-category";
import type { RulebookDraft } from "../model/rulebook-draft";
import { CoveredBooksBox } from "./covered-books-box";

interface CoveredBooksFieldProps {
  draft: RulebookDraft;
  category: DraftCategory;
  disabled?: boolean;
  onChange: (changes: Pick<RulebookDraft, "supersedesId" | "includedSupplementIds">) => void;
}

function hintOf(draft: RulebookDraft, category: DraftCategory) {
  if (draft.kind !== "core")
    return "포함하는 구판과 서플리먼트는 기본 룰북에만 지정할 수 있습니다.";
  if (!category.name) return "카테고리를 먼저 골라 주세요. 같은 카테고리의 책 가운데에서 고릅니다.";
  return null;
}

export function CoveredBooksField({ draft, category, disabled, onChange }: CoveredBooksFieldProps) {
  const hint = hintOf(draft, category);
  if (hint) {
    return (
      <Text typography="body4" foreground="hint">
        {hint}
      </Text>
    );
  }
  const current = {
    supersedesId: category.supersedesId,
    includedSupplementIds: category.includedSupplementIds,
  };
  const newCategory = category.exists
    ? undefined
    : "새 카테고리이므로 고를 수 있는 구판이 없습니다.";
  return (
    <VStack gap="150">
      {category.supersedesOptions.length > 0 ? (
        <CoveredBooksBox
          single
          title="포함하는 구판"
          description="이 책을 인증하면 함께 GM이 될 수 있는 판본입니다."
          books={category.supersedesOptions}
          selectedIds={category.supersedesId ? [category.supersedesId] : []}
          disabled={disabled}
          onChange={([supersedesId]) =>
            onChange({ ...current, supersedesId: supersedesId ?? null })
          }
        />
      ) : (
        <Text typography="body4" foreground="hint">
          {newCategory ?? "같은 카테고리에 다른 기본 룰북이 없습니다."}
        </Text>
      )}
      {category.supplementOptions.length > 0 ? (
        <CoveredBooksBox
          title="포함하는 서플리먼트"
          description="고른 서플리먼트는 이 책과 함께 인증한 것으로 봅니다. 고르지 않은 서플리먼트는 따로 인증해야 합니다."
          books={category.supplementOptions}
          selectedIds={category.includedSupplementIds}
          disabled={disabled}
          onChange={(includedSupplementIds) => onChange({ ...current, includedSupplementIds })}
        />
      ) : (
        <Text typography="body4" foreground="hint">
          같은 카테고리에 서플리먼트가 없습니다.
        </Text>
      )}
    </VStack>
  );
}
