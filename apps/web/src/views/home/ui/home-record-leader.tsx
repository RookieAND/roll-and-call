import { AvatarGroup, cn, HStack, Text } from "@roll-and-call/ui";
import { Crown } from "lucide-react";

import { ServerLink } from "@/shared/ui";

import type { RecordPerson } from "../model/rank-people";
import { HomeRecordTieSheet } from "./home-record-tie-sheet";
import { leaderName } from "./leader-name";

const CARD = "flex items-center gap-150 rounded-600 bg-primary-50 p-175 transition-colors";

interface HomeRecordLeaderProps {
  label: string;
  people: [RecordPerson, ...RecordPerson[]];
  count: number;
  unit: string;
}

// 공동 1위는 갈 곳이 하나가 아니라 카드가 동점자 시트를 연다.
export function HomeRecordLeader({ label, people, count, unit }: HomeRecordLeaderProps) {
  const [first] = people;
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
          {count}
        </Text>
        <Text weight="bold" typography="body4" foreground="inherit">
          {unit}
        </Text>
      </HStack>
    </>
  );

  if (people.length > 1)
    return (
      <HomeRecordTieSheet
        label={label}
        people={people}
        count={count}
        unit={unit}
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
