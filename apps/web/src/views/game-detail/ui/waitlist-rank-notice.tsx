import { Text } from "@trpg/ui";

import { StatusNotice } from "@/shared/ui";

export function WaitlistRankNotice({ rank, note }: { rank: number | null; note: string }) {
  return (
    <StatusNotice tone="muted" className="text-left">
      <Text typography="subtitle2" render={<p />} className="tabular-nums">
        {rank === null ? "대기로 접수됐습니다" : `대기 ${rank}번입니다`}
      </Text>
      <Text typography="body3" foreground="muted" render={<p />} className="mt-1.5">
        {note}
      </Text>
    </StatusNotice>
  );
}
