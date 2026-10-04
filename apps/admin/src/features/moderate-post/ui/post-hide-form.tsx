"use client";

import { Button, Dialog, Field, HStack, Text, Textarea, VStack, toast } from "@roll-and-call/ui";
import { isNull, isUndefined } from "es-toolkit";
import { RotateCcw } from "lucide-react";
import { useState } from "react";

import { REVIEW_REASON, useActionSubmit } from "@/shared/lib";
import type { PostDetail } from "@/shared/server";
import {
  ActionNetworkError,
  ModalServerLabel,
  NotificationPreview,
  ReasonChips,
} from "@/shared/ui";

import { submitPostModeration } from "../api/submit-post-moderation";
import { ACTION_COPY } from "../model/action-copy";
import { hideReason } from "../model/hide-reason";
import { POST_ACTION } from "../model/post-action";
import type { PostModerationOutcome } from "../model/post-moderation-outcome";

const HIDE_REASONS = Object.values(REVIEW_REASON);
const UNDO_STAFF_MEMO = "숨김 되돌리기";
const COPY = ACTION_COPY[POST_ACTION.hide];

interface PostHideFormProps {
  post: PostDetail;
  onSettled: (outcome: PostModerationOutcome) => void;
  onUndoSettled: (outcome: PostModerationOutcome) => void;
}

export function PostHideForm({ post, onSettled, onUndoSettled }: PostHideFormProps) {
  const { pending, networkError, submit } = useActionSubmit(submitPostModeration);
  const [chip, setChip] = useState<string | null>(null);
  const [otherText, setOtherText] = useState("");
  const [staffMemo, setStaffMemo] = useState("");
  const reason = hideReason({ chip, otherText });
  const canConfirm = Boolean(reason) && !pending;
  const payload = reason
    ? {
        kind: "game_hidden" as const,
        params: { gameId: post.id, gameTitle: post.title, reason },
      }
    : null;

  const undo = async () => {
    const outcome = await submitPostModeration({
      postId: post.id,
      moderation: { action: POST_ACTION.unhide, userReason: "", staffMemo: UNDO_STAFF_MEMO },
    }).catch(() => null);
    if (isNull(outcome)) {
      toast.danger("네트워크 오류로 처리하지 못했습니다.");
      return;
    }
    if (outcome.ok) toast.success(`숨김을 되돌렸습니다 · ${post.title}`);
    onUndoSettled(outcome);
  };

  const confirm = async () => {
    const outcome = await submit({
      postId: post.id,
      moderation: { action: POST_ACTION.hide, userReason: reason, staffMemo },
    });
    if (isUndefined(outcome)) return;
    if (outcome.ok) {
      toast.success(COPY.successMessage(post.title), {
        action: { label: "되돌리기", onClick: () => void undo() },
      });
    }
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
          <ReasonChips
            label="사용자에게 보여 줄 사유"
            reasons={HIDE_REASONS}
            value={chip}
            otherText={otherText}
            onValueChange={setChip}
            onOtherTextChange={setOtherText}
            disabled={pending}
          />
          <Field.Root label="운영진 메모 (사용자에게 안 보임)" htmlFor="post-hide-staff-memo">
            <Textarea
              id="post-hide-staff-memo"
              rows={2}
              value={staffMemo}
              disabled={pending}
              placeholder="판단한 근거나 확인한 내용을 적어 주세요"
              onChange={(event) => setStaffMemo(event.target.value)}
            />
          </Field.Root>
          <NotificationPreview payload={payload} recipients="GM의 알림 탭으로 알립니다." />
        </VStack>
      </Dialog.Body>
      <Dialog.Footer layout="row" className="items-center">
        <HStack align="center" gap="075" className="mr-auto text-hint">
          <RotateCcw size={14} aria-hidden />
          <Text typography="body4" foreground="hint">
            언제든 숨김 해제할 수 있습니다
          </Text>
        </HStack>
        <Dialog.Close render={<Button variant="ghost" colorPalette="gray" />} disabled={pending}>
          취소
        </Dialog.Close>
        <Button disabled={!canConfirm} loading={pending} onClick={() => void confirm()}>
          {networkError ? <RotateCcw size={16} aria-hidden /> : null}
          {networkError ? "다시 시도" : COPY.confirmLabel}
        </Button>
      </Dialog.Footer>
    </>
  );
}
