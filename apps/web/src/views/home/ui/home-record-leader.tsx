import { Avatar, Text } from "@trpg/ui";
import { Crown } from "lucide-react";
import Link from "next/link";

import type { RecordRow } from "../model/rank-people";

export function HomeRecordLeader({ row }: { row: RecordRow }) {
  return (
    <Link
      href={`/u/${row.person.id}`}
      className="flex items-center gap-3 rounded-[14px] bg-tinted-bg px-3.5 py-[13px] transition-colors hover:bg-tinted-bg-hover"
    >
      <Avatar
        src={row.person.avatarUrl}
        name={row.person.username}
        size="lg"
        className="h-11 w-11"
      />
      <div className="min-w-0 flex-1">
        <div className="mb-0.5 flex items-center gap-1 text-rank-gold">
          <Crown size={13} aria-hidden />
          <span className="text-[10.5px] font-extrabold tracking-[0.08em]">1위</span>
        </div>
        <Text
          typography="subtitle1"
          render={<div />}
          className="truncate text-[15px] font-extrabold tracking-[-0.02em]"
        >
          {row.person.username}
        </Text>
      </div>
      <div className="flex flex-none items-baseline gap-0.5 text-tinted-ink">
        <span className="text-[23px] font-extrabold tracking-[-0.03em] tabular-nums">
          {row.count}
        </span>
        <span className="text-[12px] font-bold">번</span>
      </div>
    </Link>
  );
}
