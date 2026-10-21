import { Chip, Field, HStack } from "@roll-and-call/ui";

import type { DraftCategory } from "../model/draft-category";
import type { RulebookDraft } from "../model/rulebook-draft";

interface IncludedSupplementsFieldProps {
  draft: RulebookDraft;
  category: DraftCategory;
  disabled?: boolean;
  onChange: (includedSupplementIds: string[]) => void;
}

export function IncludedSupplementsField({
  draft,
  category,
  disabled,
  onChange,
}: IncludedSupplementsFieldProps) {
  if (draft.kind !== "core" || category.supplementOptions.length === 0) return null;
  const toggle = (id: string) =>
    onChange(
      category.includedSupplementIds.includes(id)
        ? category.includedSupplementIds.filter((included) => included !== id)
        : [...category.includedSupplementIds, id],
    );
  return (
    <Field.Root
      label="포함하는 서플리먼트"
      description="이 책을 인증한 GM은 고른 서플리먼트도 인증한 것으로 봅니다. 고르지 않은 서플리먼트는 따로 인증해야 합니다."
    >
      <HStack role="group" aria-label="포함하는 서플리먼트" wrap gap="075">
        {category.supplementOptions.map((option) => {
          const checked = category.includedSupplementIds.includes(option.id);
          return (
            <Chip
              key={option.id}
              role="checkbox"
              aria-checked={checked}
              selected={checked}
              disabled={disabled}
              onClick={() => toggle(option.id)}
            >
              {option.label}
            </Chip>
          );
        })}
      </HStack>
    </Field.Root>
  );
}
