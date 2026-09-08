import { Text } from "@trpg/ui";
import { formatDateTime } from "@/shared/lib";
import { StatusNotice } from "@/shared/ui";
// 순수 표시: 대기 접수 안내 + 순번·마감. 링크/동작 없음(감싸는 쪽이 소유).
// 대기는 거절이 아니라는 걸 문장으로 못박고, 순번/마감을 함께 보여준다.
export function WaitlistNotice({
  rank,
  waitingCount,
  endDate,
}: {
  rank: number | null;
  waitingCount: number;
  endDate: Date;
}) {
  return (
    <StatusNotice tone="muted" className="text-left">
      <Text typography="subtitle2" render={<div />}>
        정원이 차서 대기로 접수됐습니다
      </Text>
      <Text typography="body3" foreground="muted" render={<p />} className="mt-1.5">
        앞 순번이 빠지면 자동으로 확정됩니다. 마감까지 순번이 오지 않아도 GM이 대기자를 모아 다음
        회차를 열 수 있습니다.
      </Text>
      <Text typography="body3" foreground="muted" render={<div />} className="mt-2">
        대기 {rank}/{waitingCount} · 마감 {formatDateTime(endDate)}
      </Text>
    </StatusNotice>
  );
}
