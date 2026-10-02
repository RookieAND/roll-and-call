"use client";

import { Button, Dialog, HStack, Text, VStack, cn, toast } from "@roll-and-call/ui";
import { Bell, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { REVIEW_REASON, withObjectParticle, type ReviewReason } from "@/shared/lib";
import type { PostDetail } from "@/shared/server";
import {
  ConflictNotice,
  ModalServerLabel,
  ServerLink,
  UserPreview,
  useServerPath,
} from "@/shared/ui";

import { submitPostModeration } from "../api/submit-post-moderation";
import { POST_ACTION } from "../model/post-action";
import { RemoveImpact } from "./remove-impact";
import { RemoveReasonRadio } from "./remove-reason-radio";
import { RemoveTarget } from "./remove-target";
import { ReportSummary } from "./report-summary";

interface PostRemoveFormProps {
  post: PostDetail;
}

export function PostRemoveForm({ post }: PostRemoveFormProps) {
  const router = useRouter();
  const toServerPath = useServerPath();
  const [pending, startTransition] = useTransition();
  const [reason, setReason] = useState<ReviewReason | null>(null);
  const [conflicted, setConflicted] = useState(false);

  const canConfirm = Boolean(reason) && !pending && !conflicted;
  const titleWithParticle = withObjectParticle(post.title);

  const confirm = () =>
    startTransition(async () => {
      if (!reason) return;
      const result = await submitPostModeration(post.id, {
        action: POST_ACTION.remove,
        userReason: REVIEW_REASON[reason],
        staffMemo: "",
      });
      if (!result.ok) {
        setConflicted(true);
        return;
      }
      toast.success(`${titleWithParticle} 제거했습니다`);
      router.push(toServerPath("/posts"));
    });

  return (
    <>
      <Dialog.Header>
        <ModalServerLabel />
        <Dialog.Title>{titleWithParticle} 제거할까요?</Dialog.Title>
        <Dialog.Description>구인과 참여 정보, 후기가 모두 삭제됩니다</Dialog.Description>
      </Dialog.Header>
      <Dialog.Body className="mt-200">
        <VStack gap="150">
          {conflicted ? (
            <ConflictNotice
              title="이미 처리된 구인입니다"
              description="입력한 내용은 저장되지 않았습니다."
              actions={
                <Button size="sm" render={<ServerLink path="/posts?filter=reported" />}>
                  다음 건
                </Button>
              }
            />
          ) : null}
          <VStack gap="150" className={cn(conflicted && "pointer-events-none opacity-50")}>
            <RemoveTarget post={post} />
            {post.unresolvedReportCount > 0 ? <ReportSummary reports={post.reports} /> : null}
            <RemoveImpact memberCount={post.memberCount} reviewCount={post.reviews.length} />
            <RemoveReasonRadio value={reason} disabled={conflicted} onValueChange={setReason} />
            <UserPreview title="GM에게 이렇게 갑니다">
              {reason ? (
                `「${post.title}」 구인이 운영진에 의해 제거되었습니다.`
              ) : (
                <Text typography="body3" foreground="hint">
                  사유를 고르면 보낼 문구가 표시됩니다.
                </Text>
              )}
            </UserPreview>
          </VStack>
        </VStack>
      </Dialog.Body>
      <Dialog.Footer layout="row" className="items-center">
        <HStack align="center" gap="075" className="mr-auto text-hint">
          <Bell size={14} aria-hidden />
          <Text typography="body4" foreground="hint">
            GM에게만 알림이 갑니다
          </Text>
        </HStack>
        <Dialog.Close render={<Button variant="ghost" colorPalette="gray" />} disabled={pending}>
          취소
        </Dialog.Close>
        <Button colorPalette="danger" disabled={!canConfirm} loading={pending} onClick={confirm}>
          <X size={16} aria-hidden />
          제거
        </Button>
      </Dialog.Footer>
    </>
  );
}
