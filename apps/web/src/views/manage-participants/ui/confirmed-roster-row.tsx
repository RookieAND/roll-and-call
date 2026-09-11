import { Avatar, HStack, IconButton, Text, VStack } from "@trpg/ui";
import { MoreHorizontal } from "lucide-react";
import type { ManagedMember } from "../model/managed-member";

// 확정 참여자 한 줄. 가능 시간을 아직 안 낸 사람은 주황으로 눈에 띄게 둔다.
export function ConfirmedRosterRow({
  member,
  onMenu,
}: {
  member: ManagedMember;
  onMenu: () => void;
}) {
  const availabilityText = member.hasAvailability ? "가능 시간 입력" : "가능 시간 미입력";

  return (
    <HStack
      align="center"
      gap={3}
      className="min-h-14 border-t border-gray-100 px-3 py-2 first:border-t-0"
    >
      <Avatar src={member.avatarUrl} name={member.username} size="stack" />
      <VStack gap={0} className="flex-1">
        <Text typography="subtitle2">{member.username}</Text>
        <Text
          typography="body4"
          className={member.hasAvailability ? "text-gray-600" : "text-warning-600"}
        >
          {member.applicationRank}번째 신청 · {availabilityText}
        </Text>
      </VStack>
      <IconButton
        variant="outline"
        aria-label="참여자 메뉴"
        onClick={onMenu}
        className="shrink-0 rounded-[10px] border-gray-200 text-gray-500"
      >
        <MoreHorizontal size={16} aria-hidden />
      </IconButton>
    </HStack>
  );
}
