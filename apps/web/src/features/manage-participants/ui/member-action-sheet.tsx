"use client";

import { Avatar, HStack, Text, VStack } from "@trpg/ui";
import { useState, useTransition } from "react";
import { ConfirmDialog, Sheet, toast } from "@/shared/ui";
import { demoteParticipant, removeParticipant } from "../api/manage-participants";
import type { MemberSummary } from "../model/member-summary";

// 확정 참여자 ⋯ 메뉴: 대기로 이동 / 내보내기(확인 다이얼로그). 열림 상태는 호출부가 member로 제어.
export function MemberActionSheet({
  gameId,
  member,
  waitingHead,
  onClose,
}: {
  gameId: string;
  member: MemberSummary | null;
  // 빈 자리를 자동으로 채울 대기 1번의 이름(없으면 안내 생략)
  waitingHead?: string;
  onClose: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const [removing, setRemoving] = useState<MemberSummary | null>(null);

  function run(action: () => Promise<{ error?: string }>, success: string) {
    startTransition(async () => {
      const result = await action();
      if (result.error) {
        toast.error(result.error);
        return;
      }
      toast.success(success);
      setRemoving(null);
      onClose();
    });
  }

  return (
    <>
      <Sheet.Root open={member !== null} onOpenChange={(open) => !open && onClose()}>
        <Sheet.Content>
          {member && (
            <VStack gap={0}>
              <HStack align="center" gap={3} className="border-b border-gray-100 pb-3.5">
                <Avatar src={member.avatarUrl} name={member.username} size="lg" />
                <VStack gap={0}>
                  <Text typography="subtitle1">{member.username}</Text>
                  <Text typography="body4" foreground="muted">
                    확정 예정 · {member.applicationRank}번째 신청
                  </Text>
                </VStack>
              </HStack>
              <Sheet.Item
                disabled={pending}
                onClick={() =>
                  run(
                    () => demoteParticipant(gameId, member.userId),
                    `${member.username}님을 대기로 옮겼습니다`,
                  )
                }
              >
                대기로 이동
                <Text typography="body4" foreground="muted">
                  대기 맨 앞
                </Text>
              </Sheet.Item>
              <Sheet.Item
                disabled={pending}
                onClick={() => setRemoving(member)}
                className="font-semibold text-red-600"
              >
                내보내기
              </Sheet.Item>
              {waitingHead && (
                <div className="mt-1.5 rounded-xl bg-gray-50 px-3 py-3">
                  <Text typography="body4" foreground="muted" render={<p />}>
                    빈 자리는 대기 맨 앞({waitingHead})이 자동으로 채웁니다.
                  </Text>
                </div>
              )}
            </VStack>
          )}
        </Sheet.Content>
      </Sheet.Root>

      <ConfirmDialog
        open={removing !== null}
        onOpenChange={(open) => !open && setRemoving(null)}
        title="참여자 내보내기"
        description={
          removing
            ? `${removing.username}님을 내보내면 신청이 취소됩니다. 되돌릴 수 없어요.`
            : undefined
        }
        confirmLabel="내보내기"
        danger
        pending={pending}
        onConfirm={() =>
          removing && run(() => removeParticipant(gameId, removing.userId), "내보냈습니다")
        }
      />
    </>
  );
}
