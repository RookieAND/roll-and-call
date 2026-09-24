import { VStack } from "@roll-and-call/ui";

import { OutcomePanel, UserPreview } from "@/shared/ui";

interface SanctionSummaryProps {
  days: number | null;
  end: string | null;
  userReason: string;
  closedCount: number;
  closedMemberCount: number;
  keptCount: number;
}

export function SanctionSummary({
  days,
  end,
  userReason,
  closedCount,
  closedMemberCount,
  keptCount,
}: SanctionSummaryProps) {
  const reason = userReason.trim();
  const restriction = end ? `${end}까지` : "해제될 때까지";
  const items = [
    {
      label: "활동 정지",
      value: days ? `${days}일` : "무기한",
      sub: end ? `${end}까지` : "해제하기 전까지",
      danger: true,
    },
    {
      label: "닫는 구인",
      value: `${closedCount}건`,
      sub: closedCount
        ? `참여자 ${closedMemberCount}명에게 운영진 조치 알림`
        : "고른 구인이 없습니다",
    },
    { label: "그대로 진행하는 활동", value: `${keptCount}건` },
  ];
  return (
    <VStack gap="150">
      <OutcomePanel items={items} />
      <UserPreview>
        {reason
          ? `${restriction} 모든 활동(참가·대기 신청, 구인 개설)이 제한돼요. 사유: ${reason}. 이의가 있다면 디스코드 #문의 채널로 알려주세요.`
          : "사유를 입력하면 사용자에게 보일 문구가 여기에 표시됩니다."}
      </UserPreview>
    </VStack>
  );
}
