"use client";

import { Avatar, HStack, Text, VStack } from "@trpg/ui";
import Link from "next/link";
import { Sheet } from "@/shared/ui";
import type { MemberSummary } from "../model/member-summary";
import { DemoteMemberItem } from "./demote-member-item";
import { RemoveMemberItem } from "./remove-member-item";

// 확정 참여자 ⋯ 메뉴. 열림 상태는 호출부가 member로 제어하고,
// 각 동작은 자기 진행 상태와 확인 절차를 직접 들고 있다.
export function MemberActionSheet({
  gameId,
  member,
  filler,
  scheduleHref,
  onClose,
}: {
  gameId: string;
  member: (MemberSummary & { hasAvailability: boolean }) | null;
  // 빈 자리를 채울 대기 1번(없으면 연쇄 안내 생략)
  filler?: { userId: string; username: string };
  // 조율형이면 조율 화면 주소. 일시 지정형은 가능 시간이 없어 행을 숨긴다.
  scheduleHref: string | null;
  onClose: () => void;
}) {
  const availabilityText = member?.hasAvailability ? "제출" : "미제출";
  const availabilityClass = member?.hasAvailability ? undefined : "text-warning-600";

  return (
    <Sheet.Root open={member !== null} onOpenChange={(open) => !open && onClose()}>
      <Sheet.Content>
        {member && (
          <VStack gap={0}>
            <HStack align="center" gap={3} className="border-b border-gray-100 pb-3.5">
              <Avatar src={member.avatarUrl} name={member.username} size="lg" />
              <VStack gap={0}>
                <Text typography="subtitle1">{member.username}</Text>
                <Text typography="body4" foreground="muted">
                  확정 · {member.applicationRank}번째 신청
                </Text>
              </VStack>
            </HStack>

            {scheduleHref && (
              <Sheet.Item asChild onClick={onClose}>
                <Link href={scheduleHref}>
                  가능 시간 보기
                  <Text typography="body4" foreground="hint" render={<span />} className={availabilityClass}>
                    {availabilityText}
                  </Text>
                </Link>
              </Sheet.Item>
            )}
            <DemoteMemberItem gameId={gameId} member={member} filler={filler} onDone={onClose} />
            <RemoveMemberItem
              gameId={gameId}
              member={member}
              fillerName={filler?.username}
              onDone={onClose}
            />
          </VStack>
        )}
      </Sheet.Content>
    </Sheet.Root>
  );
}
