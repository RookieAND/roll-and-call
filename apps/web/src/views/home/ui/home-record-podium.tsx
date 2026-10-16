import type { RankingMode } from "@roll-and-call/database/servers/model";
import { Avatar, AvatarGroup, cn, HStack, Text } from "@roll-and-call/ui";
import { Crown } from "lucide-react";

import { MemberTitle } from "@/features/view-badge";
import { ServerLink } from "@/shared/ui";

import type { RecordPerson, RecordRanking } from "../model/rank-people";
import { HomeRecordPodiumStep } from "./home-record-podium-step";
import { HomeRecordTieSheet } from "./home-record-tie-sheet";
import { recordUnit } from "./home-record-unit";
import { leaderName } from "./leader-name";
import { PodiumRankMark } from "./podium-rank-mark";

const MAX_AVATARS = 3;
const BODY =
  "flex min-w-0 flex-col items-center gap-075 rounded-t-600 bg-[radial-gradient(80%_45%_at_50%_0%,color-mix(in_srgb,var(--color-rank-gold)_42%,transparent),transparent),linear-gradient(180deg,color-mix(in_srgb,var(--color-rank-gold)_28%,var(--rc-color-bg-canvas-base))_0%,color-mix(in_srgb,var(--color-rank-gold)_10%,transparent)_60%,transparent_100%)] px-125 pt-300 pb-700 text-center shadow-[inset_0_2px_0_var(--color-rank-gold)]";

interface HomeRecordPodiumProps {
  label: string;
  ranking: RecordRanking;
  leaders: [RecordPerson, ...RecordPerson[]];
  mode: RankingMode;
}

export function HomeRecordPodium({ label, ranking, leaders, mode }: HomeRecordPodiumProps) {
  const unit = recordUnit(mode);
  const [first] = leaders;
  const [second, third] = ranking.runnersUp;

  const body = (
    <>
      <HStack align="center" gap="050" className="text-rank-gold">
        <Crown size={16} aria-hidden />
        <Text
          typography="body4"
          weight="extrabold"
          foreground="inherit"
          className="tracking-[0.08em]"
        >
          {leaders.length > 1 ? "공동 1위" : "1위"}
        </Text>
      </HStack>
      {leaders.length > 1 ? (
        <AvatarGroup
          people={leaders.map((person) => ({ src: person.avatarUrl, name: person.username }))}
          size="xl"
          max={MAX_AVATARS}
        />
      ) : (
        <Avatar name={first.username} src={first.avatarUrl} size="xl" />
      )}
      <Text typography="heading3" weight="extrabold" truncate className="max-w-full">
        {leaderName(leaders)}
      </Text>
      {leaders.length === 1 && <MemberTitle userId={first.id} />}
      <span className="flex items-baseline gap-025 text-rank-gold">
        <Text typography="heading1" weight="extrabold" numeric foreground="inherit">
          {ranking.leaderCount}
        </Text>
        <Text typography="body4" weight="bold" foreground="inherit">
          {unit}
        </Text>
      </span>
    </>
  );

  return (
    <HStack align="end" gap="125" className="pt-175">
      <HomeRecordPodiumStep row={second ?? null} position={2} mode={mode} />
      <div className="animate-rank-rise relative order-2 flex min-w-0 flex-[1.25] flex-col">
        <PodiumRankMark
          rank={1}
          shine
          className="-top-[17px] h-[34px] w-[34px] bg-rank-gold shadow-[0_4px_12px_color-mix(in_srgb,var(--color-rank-gold)_55%,transparent)]"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[1] overflow-hidden rounded-t-600"
        >
          <span className="animate-badge-shine absolute inset-0 opacity-40" />
        </span>
        {leaders.length > 1 ? (
          <HomeRecordTieSheet
            label={label}
            people={leaders}
            count={ranking.leaderCount}
            unit={unit}
            className={cn(
              BODY,
              "w-full focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none",
            )}
          >
            {body}
          </HomeRecordTieSheet>
        ) : (
          <ServerLink path={`/users/${first.id}`} className={BODY}>
            {body}
          </ServerLink>
        )}
      </div>
      <div className="order-3 flex min-w-0 flex-1 flex-col">
        <HomeRecordPodiumStep row={third ?? null} position={3} mode={mode} />
      </div>
    </HStack>
  );
}
