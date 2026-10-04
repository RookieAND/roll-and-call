import { sanctionLines } from "@/entities/sanction";

export function sanctionNoticeLines({
  reason,
  until,
}: {
  reason: string;
  until: Date | null;
}): string[] {
  return [
    ...sanctionLines({ reason, until }),
    "정지 기간에는 참가 신청·구인 개설·룰북 인증 신청을 할 수 없습니다.",
  ];
}
