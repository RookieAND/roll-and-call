import { Chip, Field, HStack, TextInput } from "@roll-and-call/ui";

import type { DraftCategory } from "../model/draft-category";
import type { RulebookDraft } from "../model/rulebook-draft";

interface SupersedesFieldProps {
  draft: RulebookDraft;
  category: DraftCategory;
  idPrefix: string;
  disabled?: boolean;
  onChange: (supersedesId: string | null) => void;
}

const NONE = { id: null, label: "없음" } as const;

function unavailable(draft: RulebookDraft, category: DraftCategory) {
  if (draft.kind !== "core") return { placeholder: "기본 룰북에만 지정할 수 있습니다" };
  if (!category.name) {
    return {
      placeholder: "카테고리를 먼저 골라 주세요",
      description: "같은 카테고리의 기본 룰북 가운데에서 고릅니다.",
    };
  }
  if (category.supersedesOptions.length > 0) return null;
  return {
    placeholder: "같은 카테고리에 다른 기본 룰북이 없습니다",
    description: category.exists ? undefined : "새 카테고리이므로 고를 수 있는 구판이 없습니다.",
  };
}

// 대신하는 구판: 이 책을 인증하면 고른 책의 구인도 열 수 있다. 고를 수 없을 때는 이유를 흐린 칸에 적는다.
export function SupersedesField({
  draft,
  category,
  idPrefix,
  disabled,
  onChange,
}: SupersedesFieldProps) {
  const blocked = unavailable(draft, category);
  if (blocked) {
    return (
      <Field.Root
        label="대신하는 구판"
        htmlFor={`${idPrefix}-supersedes`}
        description={blocked.description}
      >
        <TextInput id={`${idPrefix}-supersedes`} disabled placeholder={blocked.placeholder} />
      </Field.Root>
    );
  }
  const selected = category.supersedesOptions.find((option) => option.id === category.supersedesId);
  const description = selected
    ? `이 책을 인증한 GM은 ${selected.label} 구인도 열 수 있습니다.`
    : "판본이 다르고 연결이 없으면 서로 별개 룰로 봅니다.";
  return (
    <Field.Root label="대신하는 구판" description={description}>
      <HStack role="radiogroup" aria-label="대신하는 구판" wrap gap="075">
        {[NONE, ...category.supersedesOptions].map((option) => {
          const checked = option.id === category.supersedesId;
          return (
            <Chip
              key={option.id ?? "none"}
              role="radio"
              aria-checked={checked}
              selected={checked}
              disabled={disabled}
              onClick={() => onChange(option.id)}
            >
              {option.label}
            </Chip>
          );
        })}
      </HStack>
    </Field.Root>
  );
}
