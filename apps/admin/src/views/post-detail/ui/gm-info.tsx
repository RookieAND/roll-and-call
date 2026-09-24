import { HStack, Text, VStack } from "@roll-and-call/ui";

import { formatDate } from "@/shared/lib";
import type { PostDetail } from "@/shared/server";
import { Facts, UserInitial } from "@/shared/ui";

interface GmInfoProps {
  gm: PostDetail["gm"];
  rulebook: string;
}

export function GmInfo({ gm, rulebook }: GmInfoProps) {
  const receivedCount = gm.editRequestCount + gm.hideCount;
  const certifiedSub = gm.certifiedRulebooks.includes(rulebook) ? `${rulebook} 포함` : undefined;
  return (
    <VStack render={<section aria-label="GM 정보" />}>
      <Text
        typography="subtitle2"
        foreground="muted"
        render={<h2 />}
        className="border-y border-(--rc-color-border-subtle) bg-gray-50 px-175 py-125"
      >
        GM 정보
      </Text>
      <VStack gap="125" className="p-175">
        <HStack align="center" gap="150">
          <UserInitial nickname={gm.nickname} />
          <VStack gap="025" className="min-w-0">
            <Text typography="heading3" truncate>
              {gm.nickname}
            </Text>
            <Text typography="body4" foreground="hint">
              {formatDate(gm.joinedAt)} 가입
            </Text>
          </VStack>
        </HStack>
        <div className="border-t border-(--rc-color-border-subtle) pt-125">
          <Facts
            columns={2}
            items={[
              {
                label: "인증 룰북",
                value: `${gm.certifiedRulebooks.length}개`,
                sub: certifiedSub,
              },
              {
                label: "연 구인",
                value: `${gm.hostedCount}건`,
                sub: `진행 중 ${gm.ongoingHostedCount}건`,
              },
              {
                label: "받은 조치",
                value: `${receivedCount}회`,
                danger: receivedCount > 0,
                sub: `수정 요청 ${gm.editRequestCount} · 숨김 ${gm.hideCount}`,
              },
              { label: "처리한 불참", value: `${gm.handledNoShowCount}건` },
            ]}
          />
        </div>
      </VStack>
    </VStack>
  );
}
