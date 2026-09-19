import { AvatarGroup, cn, Text } from "@trpg/ui";
import { Crown } from "lucide-react";
import Link from "next/link";

import type { RecordPerson } from "../model/rank-people";

const CARD =
  "flex items-center gap-3 rounded-[14px] bg-tinted-bg px-3.5 py-[13px] transition-colors";

// 공동 1위는 갈 곳이 하나가 아니라 링크를 걸지 않고 카드만 둔다.
export function HomeRecordLeader({
  people,
  count,
}: {
  people: [RecordPerson, ...RecordPerson[]];
  count: number;
}) {
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
        <div className="mb-0.5 flex items-center gap-1 text-rank-gold">
          <Crown size={13} aria-hidden />
          <span className="text-[10.5px] font-extrabold tracking-[0.08em]">
            {people.length > 1 ? "공동 1위" : "1위"}
          </span>
        </div>
        <Text
          typography="subtitle1"
          render={<div />}
          className="truncate text-[15px] font-extrabold tracking-[-0.02em]"
        >
          {name}
        </Text>
      </div>
      <div className="flex flex-none items-baseline gap-0.5 text-tinted-ink">
        <span className="text-[23px] font-extrabold tracking-[-0.03em] tabular-nums">{count}</span>
        <span className="text-[12px] font-bold">번</span>
      </div>
    </>
  );

  if (people.length > 1) return <div className={CARD}>{body}</div>;

  return (
    <Link href={`/u/${first.id}`} className={cn(CARD, "hover:bg-tinted-bg-hover")}>
      {body}
    </Link>
  );
}
