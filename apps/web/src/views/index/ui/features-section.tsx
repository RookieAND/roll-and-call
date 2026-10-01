import { Badge, Container, HStack, Text, VStack } from "@roll-and-call/ui";

import { BadgeMedal, TIER_NAME } from "@/entities/badge";

import { FEATURE_HEAT_STEPS } from "../model/demo-heat";
import { FEATURE_MEDALS } from "../model/demo-medals";
import { heatBackground } from "../model/heat-background";
import { BotIcon } from "./bot-icon";
import { FeatureCard } from "./feature-card";
import { SectionHeading } from "./section-heading";

const RECRUIT_ROWS = [
  { title: "달빛 여관의 실종자", status: "모집 중", palette: "primary" },
  { title: "심연의 등대지기", status: "대기 접수 중", palette: "success" },
] as const;

const NOTICES = [
  "신청이 확정되었습니다 · 달빛 여관의 실종자",
  "가능 시간을 알려 주세요 · 마감 D-2",
];

export function FeaturesSection() {
  return (
    <Container render={<section />} className="pt-[clamp(56px,8cqw,104px)]">
      <VStack className="gap-[clamp(20px,3cqw,32px)]">
        <SectionHeading
          eyebrow="FEATURES"
          title="할 수 있는 일"
          description="구인을 올리는 순간부터 후기가 쌓일 때까지 서버 주소 하나에서 합니다."
        />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-175">
          <FeatureCard
            title="구인 모으기"
            description="시나리오와 정원, 모집 방식을 적어 올리면 신청이 한곳에 모입니다."
            visual={
              <VStack justify="center" gap="100" className="h-full">
                {RECRUIT_ROWS.map((row) => (
                  <HStack
                    key={row.title}
                    align="center"
                    gap="100"
                    className="rounded-400 border border-gray-200 bg-surface px-125 py-100"
                  >
                    <Text typography="body3" weight="bold" className="min-w-0 flex-1 truncate">
                      {row.title}
                    </Text>
                    <Badge colorPalette={row.palette}>{row.status}</Badge>
                  </HStack>
                ))}
              </VStack>
            }
          />
          <FeatureCard
            title="일정 조율"
            description="참여자가 되는 시간을 칠하면 겹치는 시간이 진하게 보입니다."
            visual={
              <HStack align="center" justify="center" className="h-full">
                <div className="grid grid-cols-[repeat(7,22px)] auto-rows-[18px] gap-050">
                  {FEATURE_HEAT_STEPS.map((step, index) => (
                    <span
                      key={index}
                      className="rounded-200"
                      style={{ background: heatBackground(step) }}
                    />
                  ))}
                </div>
              </HStack>
            }
          />
          <FeatureCard
            title="디스코드 알림"
            description="신청 결과와 확정된 일정을 디스코드로 바로 받습니다."
            visual={
              <VStack justify="center" gap="100" className="h-full">
                {NOTICES.map((notice) => (
                  <HStack key={notice} align="center" gap="100">
                    <BotIcon size={24} />
                    <Text
                      typography="body4"
                      foreground="muted"
                      className="min-w-0 flex-1 truncate rounded-400 border border-gray-200 bg-surface px-125 py-075"
                    >
                      {notice}
                    </Text>
                  </HStack>
                ))}
              </VStack>
            }
          />
          <FeatureCard
            title="다양한 업적"
            description="참여하고 운영할수록 단계별 뱃지가 쌓이고 프로필에 남습니다."
            visual={
              <HStack align="center" justify="center" gap="075" className="h-full">
                {FEATURE_MEDALS.map((medal) => (
                  <VStack key={medal.name} align="center" gap="075" className="w-[54px]">
                    <BadgeMedal emoji={medal.emoji} look={medal.grade} size="sm" />
                    <Text
                      typography="body5"
                      weight="bold"
                      foreground="muted"
                      className="whitespace-nowrap"
                    >
                      {TIER_NAME[medal.grade]}
                    </Text>
                  </VStack>
                ))}
              </HStack>
            }
          />
        </div>
      </VStack>
    </Container>
  );
}
