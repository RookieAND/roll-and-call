import { AvatarGroup, cn, HStack, Text } from "@roll-and-call/ui";
import { Crown } from "lucide-react";

import { ServerLink } from "@/shared/ui";

import type { RecordPerson, RecordRow } from "../model/rank-people";
import { HomeRecordTieSheet } from "./home-record-tie-sheet";
import { leaderName } from "./leader-name";

const CARD = "flex items-center gap-150 rounded-600 bg-primary-50 p-175 transition-colors";

interface HomeRecordLeaderProps {
  label: string;
  leaders: [RecordRow, ...RecordRow[]];
}

// 공동 1위는 갈 곳이 하나가 아니라 카드가 동점자 시트를 연다.
export function HomeRecordLeader({ label, leaders }: HomeRecordLeaderProps) {
  const people = leaders.map((leader) => leader.person) as [RecordPerson, ...RecordPerson[]];
  const [first] = people;
  const { score } = leaders[0];
  const name = leaderName(people);

  const body = (
    <>
      <AvatarGroup
        people={people.map((person) => ({ src: person.avatarUrl, name: person.username }))}
        size="lg"
        className="flex-none"
      />
      <div className="min-w-0 flex-1">
        <HStack align="center" gap="050" className="mb-025 text-gm">
          <Crown size={13} aria-hidden />
          <Text
            typography="body4"
            weight="extrabold"
            foreground="inherit"
            className="tracking-[0.08em]"
          >
            {people.length > 1 ? "공동 1위" : "1위"}
          </Text>
        </HStack>
        <Text
          typography="heading3"
          weight="extrabold"
          truncate
          render={<div />}
          className="tracking-[-0.02em]"
        >
          {name}
        </Text>
      </div>
      <HStack align="baseline" gap="025" className="flex-none text-tinted-ink">
        <Text typography="heading1" numeric foreground="inherit" className="tracking-[-0.03em]">
          {score}
        </Text>
        <Text weight="bold" typography="body4" foreground="inherit">
          점
        </Text>
      </HStack>
    </>
  );

  if (people.length > 1)
    return (
      <HomeRecordTieSheet
        label={label}
        leaders={leaders}
        className={cn(
          CARD,
          "w-full text-left hover:bg-primary-100 focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none",
        )}
      >
        {body}
      </HomeRecordTieSheet>
    );

  return (
    <ServerLink path={`/users/${first.id}`} className={cn(CARD, "hover:bg-primary-100")}>
      {body}
    </ServerLink>
  );
}
