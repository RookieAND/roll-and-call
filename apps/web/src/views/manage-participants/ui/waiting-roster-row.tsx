import { Avatar, HStack, Text } from "@trpg/ui";
import { PromoteButton } from "@/features/adjust-roster";
import type { ManagedMember } from "../model/managed-member";

// 대기자 한 줄. 맨 앞에 대기 순번, 끝에 승격 동작(feature)을 둔다.
export function WaitingRosterRow({
  gameId,
  member,
  promoteDisabled,
}: {
  gameId: string;
  member: ManagedMember;
  promoteDisabled: boolean;
}) {
  return (
    <HStack
      align="center"
      gap={3}
      className="min-h-13 border-b border-gray-100 px-3 py-2 last:border-b-0"
    >
      <Text typography="body4" foreground="hint" className="w-5 text-center font-mono">
        {member.waitlistRank}
      </Text>
      <Avatar src={member.avatarUrl} name={member.username} size="md" />
      <Text typography="subtitle2" className="flex-1">
        {member.username}
      </Text>
      <PromoteButton gameId={gameId} member={member} disabled={promoteDisabled} />
    </HStack>
  );
}
