import { Text } from "@trpg/ui";

import { StatusNotice } from "@/shared/ui";

interface WaitlistRankNoticeProps {
  rank: number | null;
  note: string;
  pendingDraw?: boolean;
}

// 추첨제는 뽑기 전까지 순번이 없다 — 숫자 대신 왜 아직 순번이 없는지 말한다.
export function WaitlistRankNotice({ rank, note, pendingDraw = false }: WaitlistRankNoticeProps) {
  return (
    <StatusNotice tone="muted" className="text-left">
      <Text typography="body4" weight="bold" numeric render={<p />}>
        {pendingDraw
          ? "아직 GM이 추첨을 진행하지 않았습니다"
          : rank === null
            ? "대기로 접수됐습니다"
            : `대기 ${rank}번입니다`}
      </Text>
      <Text typography="body3" foreground="muted" render={<p />} className="mt-075">
        {note}
      </Text>
    </StatusNotice>
  );
}
