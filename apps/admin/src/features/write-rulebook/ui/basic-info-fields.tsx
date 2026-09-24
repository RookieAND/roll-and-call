import { Field, HStack, TextInput, VStack } from "@roll-and-call/ui";

import type { RulebookDraft } from "../model/rulebook-draft";

interface BasicInfoFieldsProps {
  draft: RulebookDraft;
  idPrefix: string;
  nameError?: string;
  disabled?: boolean;
  onChange: (changes: Partial<RulebookDraft>) => void;
}

export function BasicInfoFields({
  draft,
  idPrefix,
  nameError,
  disabled,
  onChange,
}: BasicInfoFieldsProps) {
  return (
    <VStack gap="125">
      <HStack align="start" gap="125">
        <Field.Root
          label="룰북 이름"
          htmlFor={`${idPrefix}-name`}
          required
          error={nameError}
          className="flex-1"
        >
          <TextInput
            id={`${idPrefix}-name`}
            value={draft.name}
            invalid={Boolean(nameError)}
            disabled={disabled}
            onChange={(event) => onChange({ name: event.target.value })}
          />
        </Field.Root>
        <Field.Root label="판본" htmlFor={`${idPrefix}-edition`} className="w-[140px]">
          <TextInput
            id={`${idPrefix}-edition`}
            value={draft.edition}
            placeholder="없으면 비웁니다"
            disabled={disabled}
            onChange={(event) => onChange({ edition: event.target.value })}
          />
        </Field.Root>
      </HStack>
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
