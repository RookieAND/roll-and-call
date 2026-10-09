import { MESSAGE_CASES } from "@roll-and-call/database/servers/model";
import { Button, HStack, Skeleton, Text, VStack, cn } from "@roll-and-call/ui";

import { DiscordPreview, MessageSection } from "@/features/edit-discord-messages";
import { LoadingRegion, Panel, SkeletonField } from "@/shared/ui";

import { DiscordFrame } from "./discord-frame";

export function MessagesLoading() {
  return (
    <DiscordFrame title="디스코드 메시지" active="/discord/messages">
      <LoadingRegion label="디스코드 메시지를 불러오는 중입니다" className="gap-175">
        <VStack gap="025">
          <Text typography="heading2" render={<h2 />}>
            디스코드 메시지
          </Text>
          <Text typography="body3" foreground="muted">
            머리 줄, 설명 문장, 본문 알림 줄을 경우마다 정합니다. 비워 두면 기본 문구를 씁니다.
          </Text>
        </VStack>
        <div className="grid grid-cols-[216px_minmax(0,1fr)] items-start gap-150">
          <Panel bodyClassName="p-0">
            {MESSAGE_CASES.map(({ key, label }, index) => (
              <HStack
                key={key}
                align="center"
                gap="075"
                className={cn(
                  "min-h-11 px-150",
                  index > 0 && "border-t border-(--rc-color-border-subtle)",
                  index === 0 && "bg-tinted-bg shadow-[inset_4px_0_0_var(--rc-color-bg-primary)]",
                )}
              >
                <Text typography="subtitle2" className="whitespace-nowrap">
                  {label}
                </Text>
              </HStack>
            ))}
          </Panel>
          <Panel title="구인 개설" right={<Skeleton width={160} height={14} />} bodyClassName="p-0">
            <VStack gap="200" className="p-200">
              <MessageSection first title="미리보기" hint="디스코드에서 이렇게 보입니다">
                <DiscordPreview caseKey="open" text="" loading />
                <Skeleton width="60%" height={14} />
              </MessageSection>
              <MessageSection title="문구" hint="비워 두면 기본 문구를 씁니다" gap="150">
                <SkeletonField label="머리 줄" />
              </MessageSection>
              <MessageSection title="쓸 수 있는 변수">
                <HStack wrap gap="075">
                  <Skeleton width={72} height={28} rounded={400} />
                  <Skeleton width={72} height={28} rounded={400} />
                  <Skeleton width={72} height={28} rounded={400} />
                </HStack>
              </MessageSection>
              <HStack
                align="center"
                justify="between"
                gap="100"
                className="border-t border-(--rc-color-border-subtle) pt-200"
              >
                <Button variant="ghost" colorPalette="gray" disabled>
                  기본 문구로 되돌리기
                </Button>
                <Button disabled>저장</Button>
              </HStack>
            </VStack>
          </Panel>
        </div>
      </LoadingRegion>
    </DiscordFrame>
  );
}
