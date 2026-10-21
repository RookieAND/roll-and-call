import { type RankingMode } from "@roll-and-call/database/servers/model";
import { Avatar, Text } from "@roll-and-call/ui";
import type { CSSProperties } from "react";

import { MemberTitle } from "@/features/view-badge";
import { ServerLink } from "@/shared/ui";

import type { RecordRow } from "../model/rank-people";
import { recordUnit } from "./home-record-unit";
import { PodiumRankMark } from "./podium-rank-mark";

interface HomeRecordPodiumStepProps {
  row: RecordRow | null;
  position: number;
  mode: RankingMode;
}

export function HomeRecordPodiumStep({ row, position, mode }: HomeRecordPodiumStepProps) {
  const rank = row?.rank ?? position;
  const bronze = rank === 3;
  const tone = bronze ? "var(--color-rank-bronze)" : "var(--color-hint)";
  const scoreTone = bronze ? "text-rank-bronze" : "text-muted";
  const bottomPadding = bronze ? "pb-400" : "pb-600";
  const emptyHeight = bronze ? "min-h-[100px]" : "min-h-[132px]";

  return (
    <div
      className="relative flex min-w-0 flex-1 flex-col"
      style={{ "--tone": tone } as CSSProperties}
    >
      <PodiumRankMark rank={rank} className="-top-[15px] h-[30px] w-[30px] bg-(--tone)" />
      {row ? (
        <ServerLink
          path={`/users/${row.person.id}`}
          className={`flex min-w-0 flex-col items-center gap-075 rounded-t-600 bg-[linear-gradient(180deg,color-mix(in_srgb,var(--tone)_26%,var(--rc-color-bg-canvas-base))_0%,color-mix(in_srgb,var(--tone)_10%,transparent)_60%,transparent_100%)] px-100 pt-300 ${bottomPadding} text-center shadow-[inset_0_1px_0_color-mix(in_srgb,var(--tone)_70%,transparent)]`}
        >
          <Avatar name={row.person.username} src={row.person.avatarUrl} size="xl" />
          <Text typography="subtitle2" weight="extrabold" truncate className="max-w-full">
            {row.person.username}
          </Text>
          <MemberTitle userId={row.person.id} size="md" />
          <span className={`flex items-baseline gap-025 ${scoreTone}`}>
            <Text typography="heading2" weight="extrabold" numeric foreground="inherit">
              {row.count}
            </Text>
            <Text typography="body4" weight="bold" foreground="inherit">
              {recordUnit(mode)}
            </Text>
          </span>
        </ServerLink>
      ) : (
        <Text
          typography="body4"
          foreground="hint"
          render={<div />}
          className={`flex ${emptyHeight} items-center justify-center rounded-t-600 border border-b-0 border-dashed border-gray-300 px-100 py-175 text-center [mask-image:linear-gradient(180deg,#000_70%,transparent_100%)]`}
        >
          아직 비어 있습니다
        </Text>
      )}
    </div>
  );
}
