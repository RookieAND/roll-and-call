import { Avatar, Text } from "@trpg/ui";

import type { RosterMember } from "@/entities/game";

export type DetailRosterMember = RosterMember<{
  userId: string;
  user: { username: string; avatarUrl: string | null } | null;
}>;

export function RosterMemberRow({
  rank,
  member,
  note,
}: {
  rank: number;
  member: DetailRosterMember;
  note?: string;
}) {
  return (
    <div className="flex min-h-12 items-center gap-2.5 border-b border-gray-100 py-2 last:border-b-0">
      <Text typography="code2" foreground="hint" className="w-5 shrink-0 text-center tabular-nums">
        {rank}
      </Text>
      <Avatar src={member.user?.avatarUrl} name={member.user?.username} />
      <div className="min-w-0 flex-1">
        <Text typography="subtitle1" className="block truncate">
          {member.user?.username ?? "?"}
        </Text>
        {note && (
          <Text typography="body4" foreground="hint" className="block truncate">
            {note}
          </Text>
        )}
      </div>
    </div>
  );
}
