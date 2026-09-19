import { Text, VStack } from "@trpg/ui";

import { Sheet } from "@/shared/ui";

import { CollapsibleRows } from "./collapsible-rows";
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
  const description = isLottery
    ? `신청 ${applicants.length}명 · 마감 뒤 ${maxPlayers}명 확정`
    : `참여자 ${confirmed.length}명 · 대기 ${waiting.length}명`;

  function noteOf(member: DetailRosterMember, rankNote?: string) {
    const mine = member.userId === viewerId ? "나" : null;
    return [rankNote, mine].filter(Boolean).join(" · ") || undefined;
  }

  return (
    <Sheet.Root open={open} onOpenChange={onOpenChange}>
      <Sheet.Content>
        <Sheet.Title className="mb-1">명단</Sheet.Title>
        <Text typography="body4" foreground="hint" render={<p />} className="mb-3">
          {description}
        </Text>

        <div className="max-h-[60vh] overflow-y-auto">
          <VStack gap={4}>
            <RosterGroup label="GM">
              <RosterMemberRow
                userId={gm.userId}
                name={gm.username}
                avatarUrl={gm.avatarUrl}
                bio={gm.bio}
                note={gm.userId === viewerId ? "나" : undefined}
              />
            </RosterGroup>

            {isLottery ? (
              <RosterGroup label="신청" count={applicants.length} capacity={maxPlayers}>
                <CollapsibleRows>
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
                </CollapsibleRows>
                <Text typography="body4" foreground="hint" render={<p />} className="pt-1">
                  추첨 전에는 순번이 없습니다. 신청 순서로만 보여줍니다.
                </Text>
              </RosterGroup>
            ) : (
              <>
                {confirmed.length > 0 && (
                  <RosterGroup label="참여자" count={confirmed.length} capacity={maxPlayers}>
                    <CollapsibleRows>
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
                    </CollapsibleRows>
                  </RosterGroup>
                )}
                {waiting.length > 0 && (
                  <RosterGroup label="대기" count={waiting.length}>
                    <CollapsibleRows>
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
                    </CollapsibleRows>
                  </RosterGroup>
                )}
              </>
            )}
          </VStack>
        </div>
      </Sheet.Content>
    </Sheet.Root>
  );
}
