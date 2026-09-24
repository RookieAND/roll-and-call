"use client";

import {
  Button,
  Callout,
  Dialog,
  Field,
  HStack,
  Text,
  Textarea,
  VStack,
  cn,
  toast,
} from "@roll-and-call/ui";
import { ScrollText, Users } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { formatDateTime } from "@/shared/lib";
import type { PostDetail, PostModerationResult } from "@/shared/server";
import { ConflictNotice, UserPreview } from "@/shared/ui";

import { submitPostModeration } from "../api/submit-post-moderation";
import { ACTION_COPY } from "../model/action-copy";
import { POST_ACTION, type PostAction } from "../model/post-action";
import { REQUIRED_FIELD } from "../model/required-field";
import { HideImpact } from "./hide-impact";
import { ReasonFields } from "./reason-fields";
import { UnhideHistory } from "./unhide-history";

type Conflict = Extract<PostModerationResult, { ok: false }>["conflict"];

const REASON_PLACEHOLDER = {
  [POST_ACTION.edit]: "예: 시놉시스의 비하 표현",
  [POST_ACTION.hide]: "예: 선정적인 썸네일 이미지",
} as const;

const CONFLICT_VERB = {
  "구인 수정 요청": "수정을 요청",
  "구인 숨김": "숨김 처리",
  "구인 숨김 해제": "숨김을 해제",
  "신고 처리 완료": "신고를 처리",
} as const;

interface PostActionFormProps {
  post: PostDetail;
  action: PostAction;
  onDone: () => void;
}

export function PostActionForm({ post, action, onDone }: PostActionFormProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [userReason, setUserReason] = useState("");
  const [staffMemo, setStaffMemo] = useState("");
  const [conflict, setConflict] = useState<Conflict | undefined>(undefined);

  const copy = ACTION_COPY[action];
  const FooterIcon = copy.footerIcon;
  const conflicted = conflict !== undefined;
  const requiredField = REQUIRED_FIELD[action];
  const filled = { userReason: userReason.trim(), staffMemo: staffMemo.trim() };
  const canConfirm = (!requiredField || Boolean(filled[requiredField])) && !pending && !conflicted;
  const description =
    action === POST_ACTION.resolve
      ? `조치 없이 이 구인의 처리 안 된 신고 ${post.unresolvedReportCount}건을 처리됨으로 바꿉니다`
      : copy.description;
  const conflictTitle = conflict
    ? `다른 운영진(${conflict.by})이 먼저 ${CONFLICT_VERB[conflict.action as keyof typeof CONFLICT_VERB] ?? "처리"}했습니다`
    : "이미 처리된 구인입니다";
  const conflictDescription = conflict
    ? `${formatDateTime(conflict.at)}에 처리됐습니다. 입력한 내용은 저장되지 않았습니다.`
    : "입력한 내용은 저장되지 않았습니다.";
  const reasonPlaceholder =
    action === POST_ACTION.edit || action === POST_ACTION.hide ? REASON_PLACEHOLDER[action] : null;
  const gmMessage =
    action === POST_ACTION.hide
      ? `「${post.title}」 구인이 목록과 검색에서 숨겨졌어요. 사유: ${filled.userReason || "…"}. 수정한 뒤 운영진이 확인하면 다시 보여요.`
      : `「${post.title}」 구인에 대해 운영진 요청이 있어요. 사유: ${filled.userReason || "…"}. 내용을 수정한 뒤 운영진에게 알려주세요.`;

  const undoHide = async () => {
    const result = await submitPostModeration(post.id, {
      action: POST_ACTION.unhide,
      userReason: "",
      staffMemo: "숨김 되돌리기",
    });
    if (result.ok) toast.success(ACTION_COPY[POST_ACTION.unhide].successMessage(post.title));
    else toast.info("다른 운영진이 먼저 처리했습니다");
    router.refresh();
  };

  const confirm = () =>
    startTransition(async () => {
      const result = await submitPostModeration(post.id, { action, userReason, staffMemo });
      if (!result.ok) {
        setConflict(result.conflict);
        return;
      }
      if (action === POST_ACTION.hide) {
        toast.success(copy.successMessage(post.title), {
          action: { label: "되돌리기", onClick: () => void undoHide() },
        });
        router.push("/posts");
        return;
      }
      toast.success(copy.successMessage(post.title));
      onDone();
    });

  return (
    <>
      <Dialog.Header>
        <Dialog.Title>{copy.title}</Dialog.Title>
        <Dialog.Description>{description}</Dialog.Description>
      </Dialog.Header>
      <Dialog.Body className="mt-200">
        <VStack gap="150">
          {conflicted ? (
            <ConflictNotice
              title={conflictTitle}
              description={conflictDescription}
              actions={
                <Button size="sm" render={<Link href="/posts?filter=reported" />}>
                  다음 건
                </Button>
              }
            />
          ) : null}
          <VStack gap="150" className={cn(conflicted && "pointer-events-none opacity-50")}>
            {action === POST_ACTION.hide ? (
              <HideImpact
                memberCount={post.memberCount}
                waitingCount={post.waitingCount}
                startsAt={post.startsAt}
              />
            ) : null}
            {action === POST_ACTION.unhide && post.hidden ? (
              <UnhideHistory hidden={post.hidden} gmEdit={post.gmEditSinceHidden} />
            ) : null}
            {reasonPlaceholder ? (
              <>
                <ReasonFields
                  placeholder={reasonPlaceholder}
                  userReason={userReason}
                  staffMemo={staffMemo}
                  disabled={conflicted}
                  onUserReasonChange={setUserReason}
                  onStaffMemoChange={setStaffMemo}
                />
                <UserPreview title="GM에게 이렇게 갑니다">{gmMessage}</UserPreview>
              </>
            ) : (
              <Field.Root
                label="운영진 메모 (사용자에게 안 보임)"
                htmlFor="post-action-staff-memo"
                required={requiredField === "staffMemo"}
                description={action === POST_ACTION.resolve ? "활동 기록에 남습니다." : undefined}
              >
                <Textarea
                  id="post-action-staff-memo"
                  rows={2}
                  value={staffMemo}
                  disabled={conflicted}
                  placeholder={
                    action === POST_ACTION.resolve
                      ? "예: 시놉시스 표현은 작품 속 설정으로 문제없음"
                      : "확인한 내용을 적어 주세요"
                  }
                  onChange={(event) => setStaffMemo(event.target.value)}
                />
              </Field.Root>
            )}
            {action === POST_ACTION.hide ? (
              <Callout.Root colorPalette="gray" size="sm">
                <Callout.Icon>
                  <Users size={14} />
                </Callout.Icon>
                <Callout.Description>참여자에게는 알림이 가지 않습니다.</Callout.Description>
              </Callout.Root>
            ) : null}
            {action === POST_ACTION.unhide ? (
              <Callout.Root colorPalette="gray" size="sm">
                <Callout.Icon>
                  <ScrollText size={14} />
                </Callout.Icon>
                <Callout.Description>해제도 활동 기록에 남습니다.</Callout.Description>
              </Callout.Root>
            ) : null}
          </VStack>
        </VStack>
      </Dialog.Body>
      <Dialog.Footer layout="row" className="items-center">
        <HStack align="center" gap="075" className="mr-auto text-hint">
          <FooterIcon size={14} aria-hidden />
          <Text typography="body4" foreground="hint">
            {copy.footerNote}
          </Text>
        </HStack>
        <Dialog.Close render={<Button variant="ghost" colorPalette="gray" />} disabled={pending}>
          취소
        </Dialog.Close>
        <Button disabled={!canConfirm} loading={pending} onClick={confirm}>
          {copy.confirmLabel}
        </Button>
      </Dialog.Footer>
    </>
  );
}
