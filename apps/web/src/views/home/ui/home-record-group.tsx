import { Text } from "@trpg/ui";
import type { ReactNode } from "react";

import { EmptyState } from "@/shared/ui";

import type { RecordRanking } from "../model/rank-people";
import { HomeRecordLeader } from "./home-record-leader";
import { HomeRecordRow } from "./home-record-row";

export function HomeRecordGroup({
  label,
  ranking,
  emptyTitle,
  emptyDescription,
  className,
}: {
  label: string;
  ranking: RecordRanking;
  emptyTitle: string;
  emptyDescription: ReactNode;
  className?: string;
}) {
  const { leaders, leaderCount, runnersUp } = ranking;
  const [first, ...rest] = leaders;

  return (
    <div className={className}>
      <Text
        typography="body4"
        weight="extrabold"
        foreground="hint"
        render={<div />}
        className="mb-2.5 tracking-[0.06em]"
      >
        {label}
      </Text>
      {!first ? (
        <EmptyState
          size="section"
          className="p-4"
          title={emptyTitle}
          description={emptyDescription}
        />
      ) : (
        <>
          <HomeRecordLeader people={[first, ...rest]} count={leaderCount} />
          <div className="divide-y divide-gray-100 px-0.5">
            {runnersUp.map((row, index) => (
              <HomeRecordRow
                key={row?.person.id ?? `empty-${index}`}
                row={row}
                position={index + 2}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
