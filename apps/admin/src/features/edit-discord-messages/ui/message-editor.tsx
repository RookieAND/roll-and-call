"use client";

import {
  defaultMessageHead,
  MESSAGE_HEAD_MAX_LENGTH,
  messageVariables,
  validateMessageHead,
  type MessageCaseKey,
  type MessageTextKey,
} from "@roll-and-call/database/servers/model";
import { Button, Callout, Chip, HStack, Text, TextInput, VStack, toast } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";

import { conflictToastText } from "@/shared/lib";

import { checkMessageRoles } from "../api/check-message-roles";
import { saveMessageHeadAction } from "../api/save-message-head";
import { DiscordPreview } from "./discord-preview";
import { MessageTextEditor } from "./message-text-editor";

interface MessageEditorProps {
  caseKey: MessageCaseKey;
  label: string;
  savedHead: string;
  savedAt: string | null;
  // 이 경우에 속한 임베드 설명 문장들. 없으면(구인 개설·이달의 GM·PL) 머리 줄만 고친다.
  texts: { key: MessageTextKey; label: string; savedBody: string; savedAt: string | null }[];
  readOnly: boolean;
}

// 경우를 바꾸거나 저장된 값이 바뀌면 부모가 key로 새로 그린다.
export function MessageEditor({
  caseKey,
  label,
  savedHead,
  savedAt,
  texts,
  readOnly,
}: MessageEditorProps) {
  const router = useRouter();
  const [saving, startSaving] = useTransition();
  const [text, setText] = useState(savedHead);
  const [warning, setWarning] = useState<string>();
  const [failed, setFailed] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  const length = [...text].length;
  const error = validateMessageHead({ key: caseKey, text: text.trim() });
  const dirty = text.trim() !== savedHead;
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
      setFailed(false);
      try {
        const result = await saveMessageHeadAction({
          key: caseKey,
          headLine: text,
          expectedUpdatedAt: savedAt,
        });
        if (result.ok) {
          toast.success(`「${label}」 메시지를 저장했습니다`);
        } else if ("conflict" in result) {
          toast.info(
            conflictToastText({
              conflict: result.conflict.at
                ? { by: result.conflict.by, at: result.conflict.at }
                : null,
              self: false,
              target: "메시지",
            }),
          );
        } else {
          setFailed(true);
          return;
        }
        router.refresh();
      } catch {
        setFailed(true);
      }
    });

  return (
    <VStack gap="175" className="p-175">
      <VStack gap="075">
        <HStack align="baseline">
          <Text typography="body4" weight="bold" foreground="muted">
            머리 줄
          </Text>
          <Text
            typography="body4"
            numeric
            foreground={length > MESSAGE_HEAD_MAX_LENGTH ? "danger" : "hint"}
            weight={length > MESSAGE_HEAD_MAX_LENGTH ? "bold" : undefined}
            className="ml-auto"
          >
            {length} / {MESSAGE_HEAD_MAX_LENGTH}
          </Text>
        </HStack>
        <TextInput
          ref={input}
          aria-label="머리 줄"
          placeholder="머리 줄 없음"
          value={text}
          invalid={Boolean(error)}
          disabled={disabled}
          onChange={(event) => setText(event.target.value)}
          onBlur={() => void checkMessageRoles(text).then(setWarning)}
        />
        {error ? (
          <Text typography="body4" foreground="danger">
            {error}
          </Text>
        ) : null}
        {!error && warning ? (
          <Text typography="body4" className="text-notice-ink">
            {warning}
          </Text>
        ) : null}
      </VStack>
      <VStack gap="075">
        <HStack wrap gap="075">
          {messageVariables(caseKey).map((variable) => (
            <Chip key={variable} disabled={disabled} onClick={() => insert(variable)}>
              {variable}
            </Chip>
          ))}
        </HStack>
        <Text typography="body4" foreground="hint">
          역할을 직접 멘션하려면 {"<@&역할ID>"}를 적습니다.
        </Text>
      </VStack>
      <VStack gap="075">
        <Text typography="body4" weight="bold" foreground="muted">
          미리보기
        </Text>
        <DiscordPreview caseKey={caseKey} text={text} />
      </VStack>
      {failed ? (
        <Callout.Root colorPalette="danger">
          <Callout.Icon />
          <Callout.Description>
            저장하지 못했습니다.
            <br />
            잠시 뒤 다시 시도해 주세요.
          </Callout.Description>
        </Callout.Root>
      ) : null}
      <HStack align="center" justify="between" gap="100">
        <Button
          variant="ghost"
          colorPalette="gray"
          disabled={disabled || text === defaultMessageHead(caseKey)}
          onClick={() => setText(defaultMessageHead(caseKey))}
        >
          기본 문구로 되돌리기
        </Button>
        <Button loading={saving} disabled={disabled || !dirty || Boolean(error)} onClick={save}>
          저장
        </Button>
      </HStack>
      {texts.length > 0 ? (
        <VStack gap="175" className="border-t border-(--rc-color-border-subtle) pt-175">
          <VStack gap="025">
            <Text typography="subtitle2">설명 문장</Text>
            <Text typography="body4" foreground="hint">
              머리 줄 아래 임베드의 설명 한 줄입니다. 시간·인원 칸과 색, 버튼은 그대로입니다.
            </Text>
          </VStack>
          {texts.map((text) => (
            <MessageTextEditor
              key={`${text.key}:${text.savedAt ?? ""}`}
              caseKey={caseKey}
              textKey={text.key}
              label={text.label}
              savedBody={text.savedBody}
              savedAt={text.savedAt}
              readOnly={readOnly}
            />
          ))}
        </VStack>
      ) : null}
    </VStack>
  );
}
