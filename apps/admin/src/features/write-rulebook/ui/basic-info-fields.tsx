import { Field, TextInput, VStack } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import { CATEGORY_ALIAS_MAX_LENGTH } from "../model/category-alias-max-length";
import type { RulebookDraft } from "../model/rulebook-draft";

interface BasicInfoFieldsProps {
  draft: RulebookDraft;
  categories: string[];
  idPrefix: string;
  categoryHelp?: string;
  categoryError?: string;
  nameError?: string;
  disabled?: boolean;
  withAliases?: boolean;
  onChange: (changes: Partial<RulebookDraft>) => void;
  children?: ReactNode;
}

export function BasicInfoFields({
  draft,
  categories,
  idPrefix,
  categoryHelp,
  categoryError,
  nameError,
  disabled,
  withAliases = true,
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
      {draft.kind === "core" ? (
        <Field.Root
          label="카테고리 약어"
          htmlFor={`${idPrefix}-category-alias`}
          description="칭호 이름처럼 긴 카테고리 이름 대신 보여 줍니다. 한 개만 쓸 수 있고 비우면 카테고리 이름을 그대로 씁니다."
        >
          <TextInput
            id={`${idPrefix}-category-alias`}
            value={draft.categoryAlias}
            placeholder="예: 좀비라인"
            maxLength={CATEGORY_ALIAS_MAX_LENGTH}
            disabled={disabled}
            onChange={(event) =>
              onChange({ categoryAlias: event.target.value.replaceAll(",", "") })
            }
          />
        </Field.Root>
      ) : null}
      {withAliases ? (
        <Field.Root label="다른 이름" htmlFor={`${idPrefix}-aliases`}>
          <TextInput
            id={`${idPrefix}-aliases`}
            value={draft.aliasesText}
            placeholder="쉼표로 구분합니다"
            disabled={disabled}
            onChange={(event) => onChange({ aliasesText: event.target.value })}
          />
        </Field.Root>
      ) : null}
      {children}
    </VStack>
  );
}
