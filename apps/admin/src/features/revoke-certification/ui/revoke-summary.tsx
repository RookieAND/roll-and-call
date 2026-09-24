import { HStack, Text, VStack } from "@roll-and-call/ui";

import { Panel, UserPreview } from "@/shared/ui";

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
    {
      label: "인증 취소",
      value: `${rulebooks.length}개`,
      sub: rulebooks.join(", "),
      danger: false,
    },
    {
      label: "닫는 구인",
      value: `${closedCount}건`,
      sub: "참여자에게 운영진 조치 알림",
      danger: closedCount > 0,
    },
    { label: "그대로 진행하는 구인", value: `${keptCount}건`, sub: "", danger: false },
  ];
  return (
    <VStack gap="150">
      <Panel title="확정하면 일어나는 일" bodyClassName="px-175 pt-050 pb-125">
        <VStack render={<dl />}>
          {items.map((item) => (
            <HStack
              key={item.label}
              align="baseline"
              gap="150"
              className="border-t border-(--rc-color-border-subtle) py-100 first:border-t-0"
            >
              <VStack gap="025" className="min-w-0 flex-1">
                <Text typography="body4" foreground="muted" render={<dt />}>
                  {item.label}
                </Text>
                {item.sub ? (
                  <Text typography="body4" foreground="hint">
                    {item.sub}
                  </Text>
                ) : null}
              </VStack>
              <Text
                typography="subtitle2"
                foreground={item.danger ? "danger" : undefined}
                numeric
                render={<dd />}
              >
                {item.value}
              </Text>
            </HStack>
          ))}
        </VStack>
      </Panel>
      <UserPreview>
        「{rulebooks.join("」, 「")}」 룰북 인증이 취소됐어요. 사유: {userReason.trim()}. 다시
        인증받기 전까지 이 룰북으로 구인을 열 수 없어요. 이의가 있다면 디스코드 #문의 채널로
        알려주세요.
      </UserPreview>
    </VStack>
  );
}
