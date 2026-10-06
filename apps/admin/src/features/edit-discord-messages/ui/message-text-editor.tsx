"use client";

import {
  defaultMessageText,
  MESSAGE_TEXT_MAX_LENGTH,
  messageTextVariables,
  validateMessageText,
  type MessageCaseKey,
  type MessageTextKey,
} from "@roll-and-call/database/servers/model";
import { Button, Chip, HStack, Text, TextInput, VStack, toast } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";

import { conflictToastText } from "@/shared/lib";

import { saveMessageTextAction } from "../api/save-message-text";
import type { MessageRole } from "../model/message-role";
import { DiscordPreview } from "./discord-preview";

interface MessageTextEditorProps {
  caseKey: MessageCaseKey;
  textKey: MessageTextKey;
  label: string;
  savedBody: string;
  savedAt: string | null;
  guildRoles?: MessageRole[];
  readOnly: boolean;
}

// 임베드 설명 문장 한 줄. 경우를 바꾸거나 저장된 값이 바뀌면 부모가 key로 새로 그린다.
export function MessageTextEditor({
  caseKey,
  textKey,
  label,
  savedBody,
  savedAt,
  guildRoles,
  readOnly,
}: MessageTextEditorProps) {
  const router = useRouter();
  const [saving, startSaving] = useTransition();
  const [text, setText] = useState(savedBody);
  const input = useRef<HTMLInputElement>(null);

  const length = [...text].length;
  const error = validateMessageText({ key: textKey, text: text.trim() });
  const dirty = text.trim() !== savedBody;
  const disabled = readOnly || saving;

  const insert = (variable: string) => {
    const element = input.current;
    const at = element?.selectionStart ?? text.length;
    const end = element?.selectionEnd ?? at;
    setText(`${text.slice(0, at)}{${variable}}${text.slice(end)}`);
    element?.focus();
  };

  const save = () =>
    startSaving(async () => {
      try {
        const result = await saveMessageTextAction({
          key: textKey,
          body: text,
          expectedUpdatedAt: savedAt,
        });
        if (result.ok) {
          toast.success(`「${label}」 문장을 저장했습니다`);
        } else if ("conflict" in result) {
          toast.info(
            conflictToastText({
              conflict: result.conflict.at
                ? { by: result.conflict.by, at: result.conflict.at }
                : null,
              self: false,
              target: "문장",
            }),
          );
        } else {
          toast.danger("저장하지 못했습니다. 잠시 뒤 다시 시도해 주세요.");
          return;
        }
        router.refresh();
      } catch {
        toast.danger("저장하지 못했습니다. 잠시 뒤 다시 시도해 주세요.");
      }
    });

  return (
    <VStack gap="075">
      <HStack align="baseline">
        <Text typography="body4" weight="bold" foreground="muted">
          {label}
        </Text>
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
        value={text}
        invalid={Boolean(error)}
        disabled={disabled}
        onChange={(event) => setText(event.target.value)}
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
      <DiscordPreview
        caseKey={caseKey}
        text=""
        description={{ key: textKey, text }}
        guildRoles={guildRoles}
      />
      <HStack align="center" justify="between" gap="100">
        <Button
          variant="ghost"
          colorPalette="gray"
          disabled={disabled || text === defaultMessageText(textKey)}
          onClick={() => setText(defaultMessageText(textKey))}
        >
          기본 문장으로 되돌리기
        </Button>
        <Button loading={saving} disabled={disabled || !dirty || Boolean(error)} onClick={save}>
          저장
        </Button>
      </HStack>
    </VStack>
  );
}
