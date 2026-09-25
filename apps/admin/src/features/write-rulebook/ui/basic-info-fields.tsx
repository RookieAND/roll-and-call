import { Field, TextInput, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import type { RulebookDraft } from "../model/rulebook-draft";

interface BasicInfoFieldsProps {
  draft: RulebookDraft;
  categories: string[];
  idPrefix: string;
  categoryHelp?: string;
  categoryError?: string;
  nameError?: string;
  disabled?: boolean;
  onChange: (changes: Partial<RulebookDraft>) => void;
  children?: ReactNode;
}

// 카테고리·이름·판본을 한 줄에 두고, 사이에 끼울 입력(종류 등)은 children으로 받아 다른 이름 위에 놓는다.
export function BasicInfoFields({
  draft,
  categories,
  idPrefix,
  categoryHelp,
  categoryError,
  nameError,
  disabled,
  onChange,
  children,
}: BasicInfoFieldsProps) {
  const categoryPlaceholder =
    draft.kind === "core" && draft.name.trim() ? draft.name.trim() : "검색 또는 새 이름";
  return (
    <VStack gap="150">
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)_120px] items-start gap-125">
        <Field.Root
          label="카테고리"
          htmlFor={`${idPrefix}-category`}
          required
          description={categoryError ? undefined : categoryHelp}
          error={categoryError}
        >
          <TextInput
            id={`${idPrefix}-category`}
            list={`${idPrefix}-categories`}
            value={draft.category}
            placeholder={categoryPlaceholder}
            invalid={Boolean(categoryError)}
            disabled={disabled}
            onChange={(event) => onChange({ category: event.target.value })}
          />
          <datalist id={`${idPrefix}-categories`}>
            {categories.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
        </Field.Root>
        <Field.Root label="이름" htmlFor={`${idPrefix}-name`} required error={nameError}>
          <TextInput
            id={`${idPrefix}-name`}
            value={draft.name}
            invalid={Boolean(nameError)}
            disabled={disabled}
            onChange={(event) => onChange({ name: event.target.value })}
          />
        </Field.Root>
        <Field.Root label="판본" htmlFor={`${idPrefix}-edition`}>
          <TextInput
            id={`${idPrefix}-edition`}
            value={draft.edition}
            placeholder="예: 7판, 3rd"
            disabled={disabled}
            onChange={(event) => onChange({ edition: event.target.value })}
          />
        </Field.Root>
      </div>
      {children}
      <Field.Root label="다른 이름" htmlFor={`${idPrefix}-aliases`}>
        <TextInput
          id={`${idPrefix}-aliases`}
          value={draft.aliasesText}
          placeholder="쉼표로 구분합니다"
          disabled={disabled}
          onChange={(event) => onChange({ aliasesText: event.target.value })}
        />
      </Field.Root>
    </VStack>
  );
}
