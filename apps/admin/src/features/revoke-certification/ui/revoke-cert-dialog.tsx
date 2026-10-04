"use client";

import { NOTIFICATION_KIND } from "@roll-and-call/database/notifications/model";
import {
  AlertDialog,
  Button,
  Callout,
  Field,
  Text,
  TextInput,
  Textarea,
  VStack,
  toast,
} from "@roll-and-call/ui";
import { isUndefined, uniq } from "es-toolkit";
import { RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import {
  conflictToastText,
  EBOOK_REJECT_REASONS,
  OTHER_REASON,
  REJECT_REASONS,
  useActionSubmit,
} from "@/shared/lib";
import type { RevokeTarget } from "@/shared/server";
import {
  ActionNetworkError,
  ModalServerLabel,
  NotificationPreview,
  ReasonChips,
} from "@/shared/ui";

import { revokeUserCertification } from "../api/revoke-user-certification";
import { RevokeGameList } from "./revoke-game-list";

interface RevokeCertDialogProps {
  target: RevokeTarget;
  staffChannel: boolean;
  onClose: () => void;
}

export function RevokeCertDialog({ target, staffChannel, onClose }: RevokeCertDialogProps) {
  const router = useRouter();
  const backRef = useRef<HTMLButtonElement>(null);
  const { pending, networkError, submit } = useActionSubmit(revokeUserCertification);
  const [chip, setChip] = useState<string | null>(null);
  const [userReason, setUserReason] = useState("");
  const [staffMemo, setStaffMemo] = useState("");
  const reasons = target.ebook ? EBOOK_REJECT_REASONS : REJECT_REASONS;
  const other = chip === OTHER_REASON;
  const gameCount = target.games.length;
  const canRevoke = Boolean(chip && userReason.trim()) && !pending;
  const confirmLabel = gameCount > 0 ? `반려로 돌리고 구인 ${gameCount}개 취소` : "반려로 돌리기";

  const revoke = async () => {
    const result = await submit({
      userId: target.userId,
      rulebookId: target.rulebookId,
      reasonTag: other ? null : chip,
      userReason,
      staffMemo,
    });
    if (isUndefined(result)) return;
    onClose();
    router.refresh();
    if (!result.ok) {
      toast.info(
        conflictToastText({ conflict: result.conflict, self: result.self, target: "인증" }),
      );
      return;
    }
    toast.success(`${target.nickname}님의 ${target.rulebook} 인증을 반려로 돌렸습니다`);
  };

  const chooseReason = (next: string) => {
    setChip(next);
    setUserReason(reasons.find((reason) => reason.name === next)?.message ?? "");
  };

  return (
    <AlertDialog.Root open onOpenChange={(nextOpen) => nextOpen || pending || onClose()}>
      <AlertDialog.Popup initialFocus={backRef} className="max-w-[600px]">
        <AlertDialog.Header>
          <ModalServerLabel />
          <AlertDialog.Title>인증을 반려로 돌릴까요?</AlertDialog.Title>
          <AlertDialog.Description>
            {`${target.nickname}님의 「${target.rulebook}」 인증을 반려 상태로 바꿉니다.`}
          </AlertDialog.Description>
        </AlertDialog.Header>
        <AlertDialog.Body className="mt-200">
          <VStack gap="175">
            {networkError ? <ActionNetworkError /> : null}
            <VStack gap="150">
              <ReasonChips
                label="반려 사유"
                reasons={uniq([...reasons.map((reason) => reason.name), OTHER_REASON])}
                value={chip}
                otherText={other ? userReason : ""}
                onValueChange={chooseReason}
                onOtherTextChange={setUserReason}
                otherLabel="사용자에게 보이는 사유"
                otherPlaceholder="사용자에게 보이는 사유를 직접 적어 주세요"
                disabled={pending}
              />
              {chip && !other ? (
                <Field.Root
                  label="사용자에게 보이는 사유"
                  htmlFor="revoke-user-reason"
                  required
                  description="당사자의 신청 상세에 그대로 보입니다."
                >
                  <Textarea
                    id="revoke-user-reason"
                    rows={2}
                    value={userReason}
                    disabled={pending}
                    onChange={(event) => setUserReason(event.target.value)}
                  />
                </Field.Root>
              ) : null}
              <Field.Root label="운영진 메모 (사용자에게 안 보임)" htmlFor="revoke-staff-memo">
                <TextInput
                  id="revoke-staff-memo"
                  placeholder="선택"
                  value={staffMemo}
                  disabled={pending}
                  onChange={(event) => setStaffMemo(event.target.value)}
                />
              </Field.Root>
            </VStack>
            {gameCount > 0 ? (
              <RevokeGameList games={target.games} />
            ) : (
              <Callout.Root colorPalette="gray" size="sm">
                <Callout.Icon />
                <Callout.Description>취소되는 구인이 없습니다</Callout.Description>
              </Callout.Root>
            )}
            <VStack>
              {gameCount > 0 ? (
                <Text typography="body4" foreground="muted">
                  {`반려로 돌리면 위 구인 ${gameCount}개가 모두 "취소됨"이 됩니다.`}
                </Text>
              ) : null}
              <Text typography="body4" foreground="muted">
                끝난 세션은 그대로 남습니다.
              </Text>
            </VStack>
            <NotificationPreview
              payload={{
                kind: NOTIFICATION_KIND.certRevoked,
                params: {
                  rulebookId: target.rulebookId,
                  rulebookName: target.rulebook,
                  cancelledGameCount: gameCount,
                },
              }}
              recipients={
                gameCount > 0
                  ? "취소되는 구인의 확정 참여자와 대기자에게도 알림 탭으로 알립니다."
                  : undefined
              }
            />
            {staffChannel ? (
              <Text typography="body4" foreground="hint">
                운영진 채널에 조치 글을 올립니다.
              </Text>
            ) : null}
          </VStack>
        </AlertDialog.Body>
        <AlertDialog.Footer layout="row" className="items-center justify-end">
          <Button
            ref={backRef}
            variant="ghost"
            colorPalette="gray"
            disabled={pending}
            onClick={onClose}
          >
            돌아가기
          </Button>
          <Button
            colorPalette="danger"
            loading={pending}
            disabled={!canRevoke}
            onClick={() => void revoke()}
          >
            {networkError ? <RotateCcw size={16} aria-hidden /> : null}
            {networkError ? "다시 시도" : confirmLabel}
          </Button>
        </AlertDialog.Footer>
      </AlertDialog.Popup>
    </AlertDialog.Root>
  );
}
