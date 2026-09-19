import { Text } from "@trpg/ui";

import { Sheet } from "@/shared/ui";

import { RosterGroup } from "./roster-group";
import { type DetailRosterMember, RosterMemberRow } from "./roster-member-row";

export function RosterSheet({
  open,
  onOpenChange,
  gm,
  confirmed,
  waiting,
  maxPlayers,
  isLottery,
  viewerId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gm: { userId: string; username?: string; avatarUrl?: string | null; bio?: string | null };
  confirmed: DetailRosterMember[];
  waiting: DetailRosterMember[];
  maxPlayers: number;
  isLottery: boolean;
  viewerId: string | null;
}) {
  const applicants = [...confirmed, ...waiting];

  function noteOf(member: DetailRosterMember, rankNote?: string) {
    const mine = member.userId === viewerId ? "나" : null;
    return [rankNote, mine].filter(Boolean).join(" · ") || undefined;
  }

  const gmRow = (
    <RosterMemberRow
      userId={gm.userId}
      name={gm.username}
      avatarUrl={gm.avatarUrl}
      bio={gm.bio}
      note={gm.userId === viewerId ? "GM · 나" : "GM"}
    />
  );

  return (
    <Sheet.Root open={open} onOpenChange={onOpenChange}>
      <Sheet.Content>
        <Sheet.Title className="mb-3">명단</Sheet.Title>

        <div className="max-h-[60vh] divide-y divide-gray-200 overflow-y-auto [&>*+*]:mt-3 [&>*+*]:pt-3">
          {isLottery ? (
            <>
              <RosterGroup label="GM">{gmRow}</RosterGroup>
              <RosterGroup label="신청" count={applicants.length} capacity={maxPlayers}>
                {applicants.map((member) => (
                  <RosterMemberRow
                    key={member.userId}
                    userId={member.userId}
                    name={member.user?.username}
                    avatarUrl={member.user?.avatarUrl}
                    bio={member.user?.bio}
                    note={noteOf(member)}
                  />
                ))}
              </RosterGroup>
              <Text typography="body4" foreground="hint" render={<p />} className="pt-2">
                추첨 전에는 순번이 없습니다. 신청 순서로만 보여줍니다.
              </Text>
            </>
          ) : (
            <>
              {/* GM도 자리를 차지하는 확정 인원이라 같은 묶음에서 읽힌다. */}
              <RosterGroup label="확정" count={confirmed.length + 1} hint="GM 포함">
                {gmRow}
                {confirmed.map((member) => (
                  <RosterMemberRow
                    key={member.userId}
                    userId={member.userId}
                    name={member.user?.username}
                    avatarUrl={member.user?.avatarUrl}
                    bio={member.user?.bio}
                    note={noteOf(member)}
                  />
                ))}
              </RosterGroup>
              {waiting.length > 0 && (
                <RosterGroup label="대기" count={waiting.length}>
                  {waiting.map((member) => (
                    <RosterMemberRow
                      key={member.userId}
                      userId={member.userId}
                      name={member.user?.username}
                      avatarUrl={member.user?.avatarUrl}
                      bio={member.user?.bio}
                      note={noteOf(member, `대기 ${member.waitlistRank}번`)}
                    />
                  ))}
                </RosterGroup>
              )}
            </>
          )}
        </div>
      </Sheet.Content>
    </Sheet.Root>
  );
}
