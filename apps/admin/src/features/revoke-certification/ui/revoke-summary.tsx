import { VStack } from "@roll-and-call/ui";

import { OutcomePanel, UserPreview } from "@/shared/ui";

interface RevokeSummaryProps {
  rulebooks: string[];
  userReason: string;
  closedCount: number;
  keptCount: number;
}

export function RevokeSummary({
  rulebooks,
  userReason,
  closedCount,
  keptCount,
}: RevokeSummaryProps) {
  const items = [
    { label: "인증 취소", value: `${rulebooks.length}개`, sub: rulebooks.join(", ") },
    {
      label: "닫는 구인",
      value: `${closedCount}건`,
      sub: "참여자에게 운영진 조치 알림",
      danger: closedCount > 0,
    },
    { label: "그대로 진행하는 구인", value: `${keptCount}건` },
  ];
  return (
    <VStack gap="150">
      <OutcomePanel items={items} />
      <UserPreview>
        「{rulebooks.join("」, 「")}」 룰북 인증이 취소됐어요. 사유: {userReason.trim()}. 다시
        인증받기 전까지 이 룰북으로 구인을 열 수 없어요. 이의가 있다면 디스코드 #문의 채널로
        알려주세요.
      </UserPreview>
    </VStack>
  );
}
