"use client";

import { OTHER_REASON_CODE } from "@roll-and-call/database/moderation/model";
import {
  Button,
  Card,
  Dialog,
  Field,
  HStack,
  Text,
  Textarea,
  VStack,
  toast,
} from "@roll-and-call/ui";
import { isUndefined } from "es-toolkit";
import { RotateCcw, Users, X } from "lucide-react";
import { useState, type RefObject } from "react";

import { draftReason, useActionSubmit } from "@/shared/lib";
import type { PostDetail } from "@/shared/server";
import { ActionNetworkError, ModalServerLabel, NotificationPreview } from "@/shared/ui";

import { submitPostModeration } from "../api/submit-post-moderation";
import { ACTION_COPY } from "../model/action-copy";
import { POST_ACTION } from "../model/post-action";
import type { PostModerationOutcome } from "../model/post-moderation-outcome";
import { RemoveReasonRadio } from "./remove-reason-radio";
import { RemoveTarget } from "./remove-target";

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
        <Dialog.Title>{COPY.title}</Dialog.Title>
        <Dialog.Description>{COPY.description}</Dialog.Description>
      </Dialog.Header>
      <Dialog.Body>
        <VStack gap="150">
          {networkError ? <ActionNetworkError /> : null}
          <RemoveTarget post={post} />
          <Card.Root radius={400} padding="sm" render={<HStack align="center" gap="100" />}>
            <Users size={14} aria-hidden />
            <Text typography="body3" weight="bold">
              참여자 {memberCount}명 · 대기 {waitingCount}명에게 영향이 있습니다
            </Text>
          </Card.Root>
          <RemoveReasonRadio value={code} disabled={pending} onValueChange={setCode} />
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
        </VStack>
      </Dialog.Body>
      <Dialog.Footer layout="row" className="items-center justify-end">
        <Dialog.Close
          ref={cancelRef}
          render={<Button variant="ghost" colorPalette="gray" />}
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
