import { AvatarGroup, cn, HStack, Text } from "@roll-and-call/ui";
import { Crown } from "lucide-react";
import Link from "next/link";

import type { RecordPerson } from "../model/rank-people";

const CARD = "flex items-center gap-150 rounded-600 bg-tinted-bg px-175 py-175 transition-colors";

interface HomeRecordLeaderProps {
  people: [RecordPerson, ...RecordPerson[]];
  count: number;
}

// 공동 1위는 갈 곳이 하나가 아니라 링크를 걸지 않고 카드만 둔다.
export function HomeRecordLeader({ people, count }: HomeRecordLeaderProps) {
  const [first, ...rest] = people;
  const name =
    rest.length === 0
      ? first.username
      : rest.length === 1
        ? people.map((person) => person.username).join(" · ")
        : `${first.username} 외 ${rest.length}인`;

  const body = (
    <>
      <AvatarGroup
        people={people.map((person) => ({ src: person.avatarUrl, name: person.username }))}
        size="lg"
        className="flex-none"
      />
      <div className="min-w-0 flex-1">
        <HStack align="center" gap="050" className="mb-025 text-rank-gold">
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
          번
        </Text>
      </HStack>
    </>
  );

  if (people.length > 1) return <div className={CARD}>{body}</div>;

  return (
    <Link href={`/u/${first.id}`} className={cn(CARD, "hover:bg-tinted-bg-hover")}>
      {body}
    </Link>
  );
}
