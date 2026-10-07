import { MESSAGE_CASES } from "@roll-and-call/database/servers/model";
import { Button, Skeleton, Text, VStack } from "@roll-and-call/ui";

import { DiscordPreview } from "@/features/edit-discord-messages";
import { LoadingRegion, Panel, SkeletonField } from "@/shared/ui";

import { SettingsFrame } from "./settings-frame";

export function MessagesLoading() {
  return (
    <SettingsFrame title="디스코드 메시지" active="/settings/messages">
      <LoadingRegion label="디스코드 메시지를 불러오는 중입니다" className="gap-175">
        <VStack gap="025">
          <Text typography="heading2" render={<h2 />}>
            디스코드 메시지
          </Text>
          <Text typography="body3" foreground="muted">
            봇이 보내는 메시지 위에 붙일 한 줄을 경우마다 정합니다.
          </Text>
          <Text typography="body3" foreground="muted">
            비워 두면 기본 문구를 씁니다.
          </Text>
        </VStack>
        <div className="grid grid-cols-[216px_minmax(0,1fr)] items-start gap-150">
          <Panel bodyClassName="p-0">
            {MESSAGE_CASES.map(({ key, label, to }, index) => (
              <VStack
                key={key}
                gap="025"
                className={
                  index > 0
                    ? "border-t border-(--rc-color-border-subtle) px-150 py-100"
                    : "px-150 py-100"
                }
              >
                <Text typography="subtitle2" className="whitespace-nowrap">
                  {label}
                </Text>
                <div className="flex items-center gap-100">
                  <Text typography="body4" foreground="muted" className="whitespace-nowrap">
                    {to}
                  </Text>
                  <Skeleton width={120} height={12} />
                </div>
              </VStack>
            ))}
          </Panel>
          <Panel title="구인 개설" bodyClassName="p-175">
            <VStack gap="175">
              <SkeletonField label="머리 줄" />
              <DiscordPreview caseKey="open" text="" loading />
              <div className="flex justify-between">
                <Button variant="ghost" colorPalette="gray" disabled>
                  기본 문구로 되돌리기
                </Button>
                <Button disabled>저장</Button>
              </div>
            </VStack>
          </Panel>
        </div>
      </LoadingRegion>
    </SettingsFrame>
  );
}
