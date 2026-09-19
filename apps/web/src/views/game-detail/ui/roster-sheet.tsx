import { Text } from "@trpg/ui";

import { Sheet } from "@/shared/ui";

import { RosterGroup } from "./roster-group";
import { type DetailRosterMember, RosterMemberRow } from "./roster-member-row";

export type RosterSheetSection = "confirmed" | "waiting";

export function RosterSheet({
  open,
  onOpenChange,
  section,
  gm,
  confirmed,
  waiting,
  isLottery,
  viewerId,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  section: RosterSheetSection;
  gm: { userId: string; username?: string; avatarUrl?: string | null; bio?: string | null };
  confirmed: DetailRosterMember[];
  waiting: DetailRosterMember[];
  isLottery: boolean;
  viewerId: string | null;
}) {
  const applicants = [...confirmed, ...waiting];

  function noteOf(member: DetailRosterMember, rankNote?: string) {
    const mine = member.userId === viewerId ? "나" : null;
    return [rankNote, mine].filter(Boolean).join(" · ") || undefined;
  }

  function rowOf(member: DetailRosterMember, rankNote?: string) {
    return (
      <RosterMemberRow
        key={member.userId}
        userId={member.userId}
        name={member.user?.username}
        avatarUrl={member.user?.avatarUrl}
        bio={member.user?.bio}
        note={noteOf(member, rankNote)}
      />
    );
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

  // 대기자는 제 명단으로 따로 읽는다 — 참여자 시트에 섞지 않는다.
  const waitingOnly = !isLottery && section === "waiting";

  return (
    <Sheet.Root open={open} onOpenChange={onOpenChange}>
      <Sheet.Content>
        <Sheet.Title className="mb-3">
          {isLottery ? "명단" : waitingOnly ? `대기자 명단 ${waiting.length}명` : "참여자 명단"}
        </Sheet.Title>

        <div className="max-h-[60vh] divide-y divide-gray-200 overflow-y-auto [&>*+*]:mt-3 [&>*+*]:pt-3">
          {waitingOnly ? (
            <div className="divide-y divide-gray-200">
              {waiting.map((member) => rowOf(member, `대기 ${member.waitlistRank}번`))}
            </div>
          ) : (
            <>
              <RosterGroup label="GM">{gmRow}</RosterGroup>
              {isLottery ? (
                <>
                  <RosterGroup label="신청" count={applicants.length}>
                    {applicants.map((member) => rowOf(member))}
                  </RosterGroup>
                  <Text typography="body4" foreground="hint" render={<p />} className="pt-2">
                    추첨 전에는 순번이 없습니다. 신청 순서로만 보여줍니다.
                  </Text>
                </>
              ) : (
                <RosterGroup label="참여" count={confirmed.length}>
                  {confirmed.map((member) => rowOf(member))}
                </RosterGroup>
              )}
            </>
          )}
        </div>
      </Sheet.Content>
    </Sheet.Root>
  );
}
