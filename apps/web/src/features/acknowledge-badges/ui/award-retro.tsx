import { Grid, Sheet, Text, VStack } from "@roll-and-call/ui";

import { BadgeMedal } from "@/entities/badge";

import type { AwardSheet } from "../model/award-sheet";

interface AwardRetroProps {
  sheet: Extract<AwardSheet, { kind: "retro" }>;
}

export function AwardRetro({ sheet }: AwardRetroProps) {
  return (
    <VStack gap="225">
      <VStack gap="075" className="px-050 pt-050">
        <Text typography="body3" weight="extrabold" foreground="primary">
          업적이 생겼습니다
        </Text>
        <Sheet.Title render={<Text typography="heading2" render={<h2 />} />}>
          지금까지의 업적 {sheet.items.length}개
        </Sheet.Title>
        <Text typography="body2" foreground="muted" className="[text-wrap:pretty]">
          지난 세션 기록으로 뱃지를 모았습니다.
          <br />
          대표 뱃지를 골라 프로필에 걸어 두세요.
        </Text>
      </VStack>
      <Grid cols={4} gap="150" render={<ul />} className="max-h-[40dvh] overflow-y-auto py-075">
        {sheet.items.map((item) => (
          <VStack key={item.key} align="center" gap="075" render={<li />} className="text-center">
            <BadgeMedal emoji={item.emoji} look={item.look} ribbon={item.ribbon} />
            <Text typography="body4" weight="extrabold" className="leading-tight text-balance">
              {item.name}
            </Text>
          </VStack>
        ))}
      </Grid>
    </VStack>
  );
}
