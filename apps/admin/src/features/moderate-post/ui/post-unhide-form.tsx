"use client";

import { Button, Card, Dialog, Field, Text, Textarea, VStack, toast } from "@roll-and-call/ui";
import { isUndefined } from "es-toolkit";
import { RotateCcw } from "lucide-react";
import { useState } from "react";

import { formatDateTime, useActionSubmit } from "@/shared/lib";
import type { PostDetail } from "@/shared/server";
import { ActionNetworkError, ModalServerLabel, NotificationPreview } from "@/shared/ui";

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
      <Dialog.Body className="mt-200">
        <VStack gap="150">
          {networkError ? <ActionNetworkError /> : null}
          {hidden ? (
            <Card.Root radius={400} background="subtle" padding="sm" render={<VStack gap="050" />}>
              <Text typography="body3">
                {formatDateTime(hidden.at)}에 {hidden.by}님이 숨겼습니다. 사유: {hidden.reason}
              </Text>
              {editedSinceHiddenAt ? (
                <Text typography="body4" foreground="muted">
                  숨긴 뒤 마지막 수정 {formatDateTime(editedSinceHiddenAt)}
                </Text>
              ) : null}
            </Card.Root>
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
      <Dialog.Footer layout="row" className="items-center justify-end">
        <Dialog.Close render={<Button variant="ghost" colorPalette="gray" />} disabled={pending}>
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
