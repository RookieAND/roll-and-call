"use client";

import {
  defaultMessageText,
  MESSAGE_TEXT_MAX_LENGTH,
  messageTextVariables,
  validateMessageText,
  type MessageTextKey,
} from "@roll-and-call/database/servers/model";
import { Button, Chip, HStack, Text, TextInput, VStack } from "@roll-and-call/ui";
import { useRef } from "react";

interface MessageTextEditorProps {
  textKey: MessageTextKey;
  label: string;
  value: string;
  disabled: boolean;
  onChange: (text: string) => void;
  onActivate: () => void;
}

// 임베드 설명 문장 한 줄. 저장은 부모가 머리 줄과 함께 한 번에 한다.
export function MessageTextEditor({
  textKey,
  label,
  value,
  disabled,
  onChange,
  onActivate,
}: MessageTextEditorProps) {
  const input = useRef<HTMLInputElement>(null);

  const length = [...value].length;
  const error = validateMessageText({ key: textKey, text: value.trim() });
  const isDefault = value === defaultMessageText(textKey);

  const insert = (variable: string) => {
    const element = input.current;
    const at = element?.selectionStart ?? value.length;
    const end = element?.selectionEnd ?? at;
    onChange(`${value.slice(0, at)}{${variable}}${value.slice(end)}`);
    element?.focus();
  };

  return (
    <VStack gap="075">
      <HStack align="center" gap="075">
        <Text typography="body4" weight="bold" foreground="muted">
          {label}
        </Text>
        <Button
          variant="ghost"
          colorPalette="gray"
          size="sm"
          disabled={disabled || isDefault}
          onClick={() => onChange(defaultMessageText(textKey))}
        >
          기본값
        </Button>
        <Text
          typography="body4"
          numeric
          foreground={length > MESSAGE_TEXT_MAX_LENGTH ? "danger" : "hint"}
          weight={length > MESSAGE_TEXT_MAX_LENGTH ? "bold" : undefined}
          className="ml-auto"
        >
          {length} / {MESSAGE_TEXT_MAX_LENGTH}
        </Text>
      </HStack>
      <TextInput
        ref={input}
        aria-label={`${label} 설명 문장`}
        value={value}
        invalid={Boolean(error)}
        disabled={disabled}
        onFocus={onActivate}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? (
        <Text typography="body4" foreground="danger">
          {error}
        </Text>
      ) : null}
      <HStack wrap gap="075">
        {messageTextVariables(textKey).map((variable) => (
          <Chip key={variable} disabled={disabled} onClick={() => insert(variable)}>
            {variable}
          </Chip>
        ))}
      </HStack>
    </VStack>
  );
}
