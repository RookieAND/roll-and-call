"use client";

import { OTHER_REASON_CODE } from "@roll-and-call/database/moderation/model";
import { Button, Callout, Dialog, Field, Textarea, VStack, toast } from "@roll-and-call/ui";
import { isUndefined } from "es-toolkit";
import { RotateCcw, X } from "lucide-react";
import { useState, type RefObject } from "react";

import { draftReason, sessionTimeLabel, useActionSubmit } from "@/shared/lib";
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
import { RemoveReasonRadio } from "./remove-reason-radio";

const COPY = ACTION_COPY[POST_ACTION.remove];

interface PostRemoveFormProps {
  post: PostDetail;
  cancelRef: RefObject<HTMLButtonElement | null>;
  onSettled: (outcome: PostModerationOutcome) => void;
}

// 운영진 사유는 활동 기록에만 남고 알림에는 「운영진이 취소했습니다.」만 보인다.
export function PostRemoveForm({ post, cancelRef, onSettled }: PostRemoveFormProps) {
  const { pending, networkError, submit } = useActionSubmit(submitPostModeration);
  const [code, setCode] = useState<string | null>(null);
  const [staffMemo, setStaffMemo] = useState("");
  const other = code === OTHER_REASON_CODE;
  const reason = draftReason({ code, otherText: staffMemo });
  const canConfirm = Boolean(reason) && !pending;
  const { memberCount, waitingCount } = post.cancelRecipients;

  const confirm = async () => {
    if (!reason) return;
    const outcome = await submit({
      postId: post.id,
      moderation: { action: POST_ACTION.remove, reason, staffMemo: "" },
    });
    if (isUndefined(outcome)) return;
    if (outcome.ok) toast.success(COPY.successMessage(post.title));
    onSettled(outcome);
  };

  return (
    <>
      <Dialog.Header>
        <ModalServerLabel />
        <Dialog.Title>{post.title} 구인을 취소할까요?</Dialog.Title>
        <Dialog.Description>{COPY.description}</Dialog.Description>
      </Dialog.Header>
      <Dialog.Body>
        <VStack gap="150">
          {networkError ? <ActionNetworkError /> : null}
          <FactBox
            labelWidth={88}
            items={[
              { label: "구인", value: post.title },
              { label: "GM", value: post.gm.nickname },
              { label: "세션 일정", value: sessionTimeLabel(post.sessionAt) },
              { label: "참여 인원", value: `참여자 ${memberCount}명 · 대기 ${waitingCount}명` },
            ]}
          />
          <Callout.Root colorPalette="danger">
            <Callout.Icon />
            <Callout.Title>취소하면 신청과 수정이 막힙니다</Callout.Title>
            <Callout.Description>
              참여자는 신청할 수 없고, GM은 구인을 수정할 수 없습니다.
            </Callout.Description>
          </Callout.Root>
          <RemoveReasonRadio value={code} disabled={pending} onValueChange={setCode} />
          <NotificationPreview
            payload={{
              kind: "game_cancelled",
              params: {
                gameId: post.id,
                gameTitle: post.title,
                cancelKind: "staff",
                reason: null,
              },
            }}
            recipients={`GM · 확정 참여자 ${memberCount}명 · 대기자 ${waitingCount}명에게 알립니다.`}
          />
          {other ? (
            <Field.Root label="운영진 메모" htmlFor="post-remove-staff-memo" required>
              <Textarea
                id="post-remove-staff-memo"
                rows={2}
                value={staffMemo}
                disabled={pending}
                placeholder="목록에 없는 사유를 적어 주세요"
                onChange={(event) => setStaffMemo(event.target.value)}
              />
            </Field.Root>
          ) : null}
        </VStack>
      </Dialog.Body>
      <Dialog.Footer layout="row" className={MODAL_FOOTER_CLASS}>
        <Dialog.Close
          ref={cancelRef}
          render={<Button variant="outline" colorPalette="gray" />}
          disabled={pending}
        >
          취소
        </Dialog.Close>
        <Button
          colorPalette="danger"
          disabled={!canConfirm}
          loading={pending}
          onClick={() => void confirm()}
        >
          {networkError ? <RotateCcw size={16} aria-hidden /> : <X size={16} aria-hidden />}
          {networkError ? "다시 시도" : COPY.confirmLabel}
        </Button>
      </Dialog.Footer>
    </>
  );
}
