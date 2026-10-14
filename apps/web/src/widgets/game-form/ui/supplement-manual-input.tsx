"use client";

import { SUPPLEMENT_NAME_MAX } from "@roll-and-call/database/games/model";
import { Button, Field, HStack, TextInput } from "@roll-and-call/ui";
import { useState } from "react";

interface SupplementManualInputProps {
  validate: (name: string) => string | null;
  onAdd: (name: string) => void;
  onCancel: () => void;
}

export function SupplementManualInput({ validate, onAdd, onCancel }: SupplementManualInputProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const add = () => {
    const problem = validate(value);
    if (problem) {
      setError(problem);
      return;
    }
    onAdd(value.trim());
    setValue("");
  };

  return (
    <Field.Root htmlFor="supplement-name" error={error ?? undefined}>
      <HStack gap="100" align="start">
        <TextInput
          id="supplement-name"
          autoFocus
          value={value}
          maxLength={SUPPLEMENT_NAME_MAX + 10}
          placeholder="서플리먼트 이름"
          aria-label="서플리먼트 이름"
          invalid={Boolean(error)}
          className="min-w-0 flex-1"
          onChange={(event) => {
            setValue(event.target.value);
            setError(null);
          }}
          onKeyDown={(event) => {
            if (event.key !== "Enter" || event.nativeEvent.isComposing) return;
            event.preventDefault();
            add();
          }}
        />
        <Button type="button" className="h-11 px-200" onClick={add}>
          추가
        </Button>
        <Button type="button" variant="ghost" className="h-11 px-150" onClick={onCancel}>
          취소
        </Button>
      </HStack>
    </Field.Root>
  );
}
