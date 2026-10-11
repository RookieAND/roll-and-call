"use client";

import {
  defaultReviewTemplate,
  REVIEW_BODY_TEMPLATE_MAX_LENGTH,
  REVIEW_TITLE_MAX_LENGTH,
  reviewTemplateVariables,
  validateReviewTemplate,
  type ReviewTemplatePart,
} from "@roll-and-call/database/servers/model";
import { Button, Callout, Chip, HStack, Text, VStack, toast } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";

import { conflictToastText } from "@/shared/lib";

import { saveReviewTemplateAction } from "../api/save-review-template";
import { MessageField } from "./message-field";
import { MessageSection } from "./message-section";
import { ReviewTemplatePreview } from "./review-template-preview";

interface ReviewTemplateEditorProps {
  savedTitle: string;
  savedBody: string;
  savedAt: string | null;
  readOnly: boolean;
}

// 부모가 저장된 값을 key로 걸어 두어, 저장하면 이 편집기가 새 값으로 다시 그려진다.
export function ReviewTemplateEditor({
  savedTitle,
  savedBody,
  savedAt,
  readOnly,
}: ReviewTemplateEditorProps) {
  const router = useRouter();
  const [saving, startSaving] = useTransition();
  const [title, setTitle] = useState(savedTitle);
  const [body, setBody] = useState(savedBody);
  const [focused, setFocused] = useState<ReviewTemplatePart>("body");
  const [gmReview, setGmReview] = useState(false);
  const [failed, setFailed] = useState(false);
  const inputs = useRef<
    Record<ReviewTemplatePart, (HTMLInputElement & HTMLTextAreaElement) | null>
  >({ title: null, body: null });

  const titleError = validateReviewTemplate({ part: "title", text: title.trim() });
  const bodyError = validateReviewTemplate({ part: "body", text: body.trim() });
  const disabled = readOnly || saving;
  const dirty = title.trim() !== savedTitle || body.trim() !== savedBody;
  const isDefault =
    title === defaultReviewTemplate("title") && body === defaultReviewTemplate("body");
  const variables = reviewTemplateVariables(focused);

  const insert = (variable: string) => {
    const element = inputs.current[focused];
    const current = focused === "title" ? title : body;
    const at = element?.selectionStart ?? current.length;
    const end = element?.selectionEnd ?? at;
    const next = `${current.slice(0, at)}{${variable}}${current.slice(end)}`;
    if (focused === "title") setTitle(next);
    else setBody(next);
    element?.focus();
  };

  const reset = () => {
    setTitle(defaultReviewTemplate("title"));
    setBody(defaultReviewTemplate("body"));
  };

  const save = () =>
    startSaving(async () => {
      setFailed(false);
      try {
        const result = await saveReviewTemplateAction({ title, body, expectedUpdatedAt: savedAt });
        if (!result.ok && "conflict" in result) {
          toast.info(
            conflictToastText({
              conflict: result.conflict.at
                ? { by: result.conflict.by, at: result.conflict.at }
                : null,
              self: false,
              target: "메시지",
            }),
          );
        } else if (!result.ok) {
          setFailed(true);
          return;
        } else {
          toast.success("「후기」 양식을 저장했습니다");
        }
        router.refresh();
      } catch {
        setFailed(true);
      }
    });

  return (
    <VStack gap="200" className="p-200">
      <MessageSection first title="미리보기" hint="후기 채널에 이렇게 올라갑니다">
        <VStack gap="075">
          <Text typography="body4" weight="bold" foreground="muted">
            후기 종류
          </Text>
          <HStack wrap gap="075">
            <Chip selected={!gmReview} onClick={() => setGmReview(false)}>
              PL 후기
            </Chip>
            <Chip selected={gmReview} onClick={() => setGmReview(true)}>
              GM 후기
            </Chip>
          </HStack>
        </VStack>
        <ReviewTemplatePreview title={title} body={body} gmReview={gmReview} />
        <Text typography="body4" foreground="hint">
          포럼 채널은 제목과 본문으로, 텍스트 채널은 제목을 굵게 쓴 첫 줄과 본문으로 올라갑니다.
          사진은 양식과 상관없이 첨부로 붙습니다.
        </Text>
      </MessageSection>
      <MessageSection title="양식" hint="비워 두면 기본 양식을 씁니다" gap="150">
        <MessageField
          ref={(element) => {
            inputs.current.title = element;
          }}
          label="제목"
          placeholder={defaultReviewTemplate("title")}
          value={title}
          max={REVIEW_TITLE_MAX_LENGTH}
          error={titleError}
          disabled={disabled}
          onChange={setTitle}
          onFocus={() => setFocused("title")}
        />
        <MessageField
          ref={(element) => {
            inputs.current.body = element;
          }}
          label="본문"
          multiline
          rows={8}
          placeholder={defaultReviewTemplate("body")}
          value={body}
          max={REVIEW_BODY_TEMPLATE_MAX_LENGTH}
          error={bodyError}
          disabled={disabled}
          onChange={setBody}
          onFocus={() => setFocused("body")}
        />
      </MessageSection>
      <MessageSection title="쓸 수 있는 변수" hint={focused === "title" ? "제목" : "본문"}>
        <VStack gap="075">
          <HStack wrap gap="075">
            {variables.map((variable) => (
              <Chip key={variable} disabled={disabled} onClick={() => insert(variable)}>
                {variable}
              </Chip>
            ))}
          </HStack>
          <Text typography="body4" foreground="hint">
            본문 양식에는 {"{후기 본문}"}이 꼭 있어야 합니다. 멘션은 알림이 울리지 않고 이름만
            표시됩니다. 이미 올라간 후기는 그대로 두고, 후기를 새로 올리거나 고칠 때부터 이 양식을
            따릅니다.
          </Text>
          <Text typography="body4" foreground="hint">
            글자 수가 디스코드 한도(2000자)를 넘으면 양식 없이 후기 본문만 올라갑니다.
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
          기본 양식으로 되돌리기
        </Button>
        <Button
          loading={saving}
          disabled={disabled || !dirty || Boolean(titleError) || Boolean(bodyError)}
          onClick={save}
        >
          저장
        </Button>
      </HStack>
    </VStack>
  );
}
