"use client";

import { Button, Callout, Dialog, Field, Textarea, VStack, toast } from "@roll-and-call/ui";
import { isUndefined } from "es-toolkit";
import { RotateCcw } from "lucide-react";
import { useState } from "react";

import { formatDateTime, useActionSubmit } from "@/shared/lib";
import type { PostDetail } from "@/shared/server";
import {
  ActionNetworkError,
  FactBox,
  ModalServerLabel,
  NotificationPreview,
  MODAL_FOOTER_CLASS,
} from "@/shared/ui";

import { submitPostModeration } from "../api/submit-post-moderation";
import { ACTION_COPY } from "../model/action-copy";
import { POST_ACTION } from "../model/post-action";
import type { PostModerationOutcome } from "../model/post-moderation-outcome";

const COPY = ACTION_COPY[POST_ACTION.unhide];

interface PostUnhideFormProps {
  post: PostDetail;
  onSettled: (outcome: PostModerationOutcome) => void;
}

export function PostUnhideForm({ post, onSettled }: PostUnhideFormProps) {
  const { pending, networkError, submit } = useActionSubmit(submitPostModeration);
  const [staffMemo, setStaffMemo] = useState("");
  const { hidden, editedSinceHiddenAt } = post;

  const confirm = async () => {
    const outcome = await submit({
      postId: post.id,
      moderation: { action: POST_ACTION.unhide, reason: null, staffMemo },
    });
    if (isUndefined(outcome)) return;
    if (outcome.ok) toast.success(COPY.successMessage(post.title));
    onSettled(outcome);
  };

  return (
    <>
      <Dialog.Header>
        <ModalServerLabel />
        <Dialog.Title>{COPY.title}</Dialog.Title>
        <Dialog.Description>{COPY.description}</Dialog.Description>
      </Dialog.Header>
      <Dialog.Body>
        <VStack gap="150">
          {networkError ? <ActionNetworkError /> : null}
          {hidden ? (
            <FactBox
              labelWidth={88}
              items={[
                { label: "구인", value: post.title },
                { label: "숨긴 일시", value: formatDateTime(hidden.at) },
                { label: "처리한 운영진", value: hidden.by },
                { label: "숨김 사유", value: hidden.reason },
                ...(editedSinceHiddenAt
                  ? [
                      {
                        label: "GM 조치",
                        value: `구인 수정 · ${formatDateTime(editedSinceHiddenAt)}`,
                      },
                    ]
                  : []),
              ]}
            />
          ) : null}
          {editedSinceHiddenAt ? (
            <Callout.Root colorPalette="success">
              <Callout.Icon />
              <Callout.Title>GM이 숨긴 뒤 구인을 수정했습니다</Callout.Title>
              <Callout.Description>
                해제하면 구인이 목록과 검색에 다시 나타납니다.
              </Callout.Description>
            </Callout.Root>
          ) : null}
          <Field.Root label="운영진 메모 (사용자에게 안 보임)" htmlFor="post-unhide-staff-memo">
            <Textarea
              id="post-unhide-staff-memo"
              rows={2}
              value={staffMemo}
              disabled={pending}
              placeholder="확인한 내용을 적어 주세요"
              onChange={(event) => setStaffMemo(event.target.value)}
            />
          </Field.Root>
          <NotificationPreview
            payload={{ kind: "game_unhidden", params: { gameId: post.id, gameTitle: post.title } }}
            recipients="GM의 알림 탭으로 알립니다."
          />
        </VStack>
      </Dialog.Body>
      <Dialog.Footer layout="row" className={MODAL_FOOTER_CLASS}>
        <Dialog.Close render={<Button variant="outline" colorPalette="gray" />} disabled={pending}>
          취소
        </Dialog.Close>
        <Button loading={pending} disabled={pending} onClick={() => void confirm()}>
          {networkError ? <RotateCcw size={16} aria-hidden /> : null}
          {networkError ? "다시 시도" : COPY.confirmLabel}
        </Button>
      </Dialog.Footer>
    </>
  );
}
