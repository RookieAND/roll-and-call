"use client";

import {
  defaultMessageHead,
  defaultMessageText,
  MESSAGE_HEAD_MAX_LENGTH,
  MESSAGE_TEXT_MAX_LENGTH,
  messageTextVariables,
  messageVariables,
  validateMessageHead,
  validateMessageText,
  type MessageCaseKey,
  type MessageTextKey,
} from "@roll-and-call/database/servers/model";
import { Button, Callout, Chip, HStack, Text, VStack, toast } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";

import { conflictToastText } from "@/shared/lib";

import { saveMessageHeadAction } from "../api/save-message-head";
import { saveMessageTextAction } from "../api/save-message-text";
import type { MessageRole } from "../model/message-role";
import { UNKNOWN_ROLE_WARNING, unknownRoleIds } from "../model/unknown-role-ids";
import { DiscordPreview } from "./discord-preview";
import { MessageField } from "./message-field";
import { MessageSection } from "./message-section";

const FIELD_TITLE = { body: "본문 알림 줄", embed: "설명 문장" } as const;

interface MessageEditorProps {
  caseKey: MessageCaseKey;
  label: string;
  savedHead: string;
  savedAt: string | null;
  // 이 경우에 속한 임베드 설명 문장들. 없으면(구인 개설·이달의 GM·PL) 머리 줄만 고친다.
  texts: {
    key: MessageTextKey;
    label: string;
    place: "embed" | "body";
    savedBody: string;
    savedAt: string | null;
  }[];
  // 디스코드에서 못 읽으면 없다. 그때는 미리보기가 역할 이름을 못 보여 주고 경고도 내지 않는다.
  guildRoles?: MessageRole[];
  recruitForum: boolean;
  readOnly: boolean;
}

// 경우를 바꾸거나 저장된 값이 바뀌면 부모가 key로 새로 그린다.
export function MessageEditor({
  caseKey,
  label,
  savedHead,
  savedAt,
  texts,
  guildRoles,
  recruitForum,
  readOnly,
}: MessageEditorProps) {
  const router = useRouter();
  const [saving, startSaving] = useTransition();
  const [text, setText] = useState(savedHead);
  const [failed, setFailed] = useState(false);
  const [drafts, setDrafts] = useState(() =>
    Object.fromEntries(texts.map(({ key, savedBody }) => [key, savedBody])),
  );
  const labels = [...new Set(texts.map((item) => item.label))];
  const [variant, setVariant] = useState(labels[0]);
  const [focused, setFocused] = useState<"head" | MessageTextKey>("head");
  const inputs = useRef<Record<string, HTMLInputElement | null>>({});

  const shown = texts.filter((item) => item.label === variant);
  const bodyItem = shown.find((item) => item.place === "body");
  const embedItem = shown.find((item) => item.place === "embed");
  const line = (item?: (typeof texts)[number]) =>
    item ? { key: item.key, text: drafts[item.key] ?? "" } : undefined;

  const error = validateMessageHead({ key: caseKey, text: text.trim() });
  const disabled = readOnly || saving;
  const dirtyTexts = texts.filter((item) => (drafts[item.key] ?? "").trim() !== item.savedBody);
  const textError = dirtyTexts.some((item) =>
    validateMessageText({ key: item.key, text: (drafts[item.key] ?? "").trim() }),
  );
  const dirty = text.trim() !== savedHead || dirtyTexts.length > 0;
  const isDefault =
    text === defaultMessageHead(caseKey) &&
    texts.every((item) => drafts[item.key] === defaultMessageText(item.key));
  const warning =
    guildRoles && unknownRoleIds({ text, guildRoleIds: guildRoles.map(({ id }) => id) }).length > 0
      ? UNKNOWN_ROLE_WARNING
      : undefined;

  const variables = [
    ...new Set([
      ...messageVariables(caseKey),
      ...shown.flatMap((item) => messageTextVariables(item.key)),
    ]),
  ];

  const insert = (variable: string) => {
    const element = inputs.current[focused];
    const current = focused === "head" ? text : (drafts[focused] ?? "");
    const at = element?.selectionStart ?? current.length;
    const end = element?.selectionEnd ?? at;
    const next = `${current.slice(0, at)}{${variable}}${current.slice(end)}`;
    if (focused === "head") setText(next);
    else setDrafts({ ...drafts, [focused]: next });
    element?.focus();
  };

  const reset = () => {
    setText(defaultMessageHead(caseKey));
    setDrafts(Object.fromEntries(texts.map(({ key }) => [key, defaultMessageText(key)])));
  };

  const save = () =>
    startSaving(async () => {
      setFailed(false);
      try {
        const results = await Promise.all([
          ...(text.trim() !== savedHead
            ? [saveMessageHeadAction({ key: caseKey, headLine: text, expectedUpdatedAt: savedAt })]
            : []),
          ...dirtyTexts.map((item) =>
            saveMessageTextAction({
              key: item.key,
              body: drafts[item.key] ?? "",
              expectedUpdatedAt: item.savedAt,
            }),
          ),
        ]);
        const conflict = results.find((result) => !result.ok && "conflict" in result);
        if (conflict && !conflict.ok && "conflict" in conflict) {
          toast.info(
            conflictToastText({
              conflict: conflict.conflict.at
                ? { by: conflict.conflict.by, at: conflict.conflict.at }
                : null,
              self: false,
              target: "메시지",
            }),
          );
        } else if (results.some((result) => !result.ok)) {
          setFailed(true);
          return;
        } else {
          toast.success(`「${label}」 메시지를 저장했습니다`);
        }
        router.refresh();
      } catch {
        setFailed(true);
      }
    });

  return (
    <VStack gap="200" className="p-200">
      <MessageSection first title="미리보기" hint="디스코드에서 이렇게 보입니다">
        {labels.length > 1 ? (
          <VStack gap="075">
            <Text typography="body4" weight="bold" foreground="muted">
              보내는 경우
            </Text>
            <HStack wrap gap="075">
              {labels.map((item) => (
                <Chip key={item} selected={item === variant} onClick={() => setVariant(item)}>
                  {item}
                </Chip>
              ))}
            </HStack>
          </VStack>
        ) : null}
        <DiscordPreview
          caseKey={caseKey}
          text={text}
          bodyLine={line(bodyItem)}
          description={line(embedItem)}
          guildRoles={guildRoles}
          recruitForum={recruitForum}
        />
        {caseKey === "open" ? (
          <Text typography="body4" foreground="hint">
            {recruitForum
              ? "포럼 글 맨 위에 구인글 상세 링크가 고정으로 붙습니다. 본문과 버튼은 고칠 수 없습니다."
              : "텍스트 채널에는 임베드로 나가며 설명은 구인 줄거리를 그대로 씁니다."}
          </Text>
        ) : null}
        {caseKey === "monthly" ? (
          <Text typography="body4" foreground="hint">
            본문은 임베드 없이 평문으로 나가며 고칠 수 없습니다.
          </Text>
        ) : null}
      </MessageSection>
      <MessageSection title="문구" hint="비워 두면 기본 문구를 씁니다" gap="150">
        <MessageField
          ref={(element) => {
            inputs.current.head = element;
          }}
          label="머리 줄"
          placeholder={defaultMessageHead(caseKey)}
          value={text}
          max={MESSAGE_HEAD_MAX_LENGTH}
          error={error}
          warning={warning}
          disabled={disabled}
          onChange={setText}
          onFocus={() => setFocused("head")}
        />
        {[bodyItem, embedItem].map((item) =>
          item ? (
            <MessageField
              key={item.key}
              ref={(element) => {
                inputs.current[item.key] = element;
              }}
              label={FIELD_TITLE[item.place]}
              placeholder={defaultMessageText(item.key)}
              value={drafts[item.key] ?? ""}
              max={MESSAGE_TEXT_MAX_LENGTH}
              error={validateMessageText({ key: item.key, text: (drafts[item.key] ?? "").trim() })}
              disabled={disabled}
              onChange={(draft) => setDrafts({ ...drafts, [item.key]: draft })}
              onFocus={() => setFocused(item.key)}
            />
          ) : null,
        )}
      </MessageSection>
      <MessageSection title="쓸 수 있는 변수">
        <VStack gap="075">
          <HStack wrap gap="075">
            {variables.map((variable) => (
              <Chip key={variable} disabled={disabled} onClick={() => insert(variable)}>
                {variable}
              </Chip>
            ))}
          </HStack>
          <Text typography="body4" foreground="hint">
            역할 멘션은 {"<@&역할ID>"}로 적습니다.
          </Text>
        </VStack>
      </MessageSection>
      {failed ? (
        <Callout.Root colorPalette="danger">
          <Callout.Icon />
          <Callout.Title>저장하지 못했습니다</Callout.Title>
          <Callout.Description>잠시 뒤 다시 시도해 주세요.</Callout.Description>
        </Callout.Root>
      ) : null}
      <HStack
        align="center"
        justify="between"
        gap="100"
        className="border-t border-(--rc-color-border-subtle) pt-200"
      >
        <Button
          variant="ghost"
          colorPalette="gray"
          disabled={disabled || isDefault}
          onClick={reset}
        >
          기본 문구로 되돌리기
        </Button>
        <Button
          loading={saving}
          disabled={disabled || !dirty || Boolean(error) || textError}
          onClick={save}
        >
          저장
        </Button>
      </HStack>
    </VStack>
  );
}
