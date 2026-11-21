import type { RankingMode } from "@roll-and-call/database/servers/model";
import { AvatarGroup, cn, HStack, Text } from "@roll-and-call/ui";
import { Crown } from "lucide-react";

import type { RecordPerson } from "@/entities/badge";
import { MemberTitle } from "@/features/view-badge";
import { ServerLink } from "@/shared/ui";

import { HomeRecordCount } from "./home-record-count";
import { HomeRecordTieSheet } from "./home-record-tie-sheet";
import { leaderName } from "./leader-name";

// 공동 1위가 많아도 아바타가 이름과 점수 자리를 밀어내지 않도록 둘까지만 보이고 나머지는 +N으로 묶는다.
const MAX_AVATARS = 2;
const CARD =
  "animate-rank-rise flex items-center gap-150 rounded-600 bg-primary-50 p-175 transition-colors";

interface HomeRecordLeaderProps {
  label: string;
  people: [RecordPerson, ...RecordPerson[]];
  count: number;
  mode: RankingMode;
}

// 공동 1위는 갈 곳이 하나가 아니라 카드가 동점자 시트를 연다.
export function HomeRecordLeader({ label, people, count, mode }: HomeRecordLeaderProps) {
  const [first] = people;
  const name = leaderName(people);

  const body = (
    <>
      <AvatarGroup
        people={people.map((person) => ({ src: person.avatarUrl, name: person.username }))}
        size="lg"
        max={MAX_AVATARS}
        className="flex-none"
      />
      <div className="min-w-0 flex-1">
        <HStack align="center" gap="050" className="mb-025 text-gm">
          <Crown size={13} aria-hidden />
          <Text
            typography="body4"
            weight="extrabold"
            foreground="inherit"
            className="tracking-[0.08em] whitespace-nowrap"
          >
            {people.length > 1 ? "공동 1위" : "1위"}
          </Text>
        </HStack>
        <HStack align="center" gap="075" className="min-w-0">
          <Text
            typography="heading3"
            weight="extrabold"
            truncate
            render={<div />}
            className="tracking-[-0.02em]"
          >
            {name}
          </Text>
          {people.length === 1 && <MemberTitle userId={first.id} />}
        </HStack>
      </div>
      <HStack align="baseline" gap="025" className="flex-none text-tinted-ink">
        <HomeRecordCount
          count={count}
          mode={mode}
          typography="heading1"
          numberClassName="tracking-[-0.03em]"
        />
      </HStack>
    </>
  );

  if (people.length > 1)
    return (
      <HomeRecordTieSheet
        label={label}
        people={people}
        count={count}
        mode={mode}
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
