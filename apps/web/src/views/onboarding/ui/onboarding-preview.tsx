import { Avatar, Badge, Button, Card, Grid, HStack, Text, VStack } from "@roll-and-call/ui";
import { Plus } from "lucide-react";

import { GAME_STATUS, GameStatusBadge } from "@/entities/game";
import { ProfileLinks } from "@/entities/profile";
import { HeatSample } from "@/shared/ui";

import type { OnboardingSlide } from "../model/onboarding-slides";
import { WizardStepMark } from "./wizard-step-mark";

const WIZARD_STEPS = [1, 2, 3, 4, 5];
const WIZARD_CURRENT_STEP = 3;
const SAMPLE_LINKS = [
  { service: "discord", value: "raon" },
  { service: "x", value: "@raon" },
];

interface OnboardingPreviewProps {
  slideKey: Exclude<OnboardingSlide["key"], "welcome">;
}

// ponytail: 온보딩 그림 자리는 실제 화면을 축소한 장식이다. 감싸는 SlideVisual이 inert라 버튼도 눌리지 않는다.
export function OnboardingPreview({ slideKey }: OnboardingPreviewProps) {
  if (slideKey === "find") {
    return (
      <Card.Root padding="none" className="w-[298px] overflow-hidden shadow-lg">
        <HStack align="end" className="h-[74px] bg-tinted-bg p-125">
          <GameStatusBadge status={GAME_STATUS.recruiting} />
        </HStack>
        <VStack gap="100" className="px-175 pt-150 pb-175">
          <VStack gap="025">
            <Text typography="heading3" weight="extrabold" render={<span />}>
              물벼락 — 1부
            </Text>
            <Text typography="body4" foreground="hint" render={<span />}>
              GM 라온 · 크툴루의 부름 · 3시간
            </Text>
          </VStack>
          <HStack gap="075">
            <Badge>선착순</Badge>
            <Badge>확정 2 · 정원 4</Badge>
          </HStack>
          <Button size="sm" className="w-full">
            신청하기
          </Button>
        </VStack>
      </Card.Root>
    );
  }

  if (slideKey === "schedule") {
    return (
      <Card.Root radius={500} padding="sm" className="shadow-lg">
        <HeatSample />
      </Card.Root>
    );
  }

  if (slideKey === "host") {
    return (
      <Card.Root padding="none" className="w-[298px] p-175 shadow-lg">
        <VStack gap="150">
          <HStack align="center">
            {WIZARD_STEPS.map((step) => (
              <WizardStepMark
                key={step}
                step={step}
                currentStep={WIZARD_CURRENT_STEP}
                last={step === WIZARD_STEPS.length}
              />
            ))}
          </HStack>
          <Text typography="subtitle2" weight="extrabold" render={<span />}>
            이미지
          </Text>
          <Grid cols={3} gap="100">
            <span className="aspect-square rounded-400 bg-tinted-bg" />
            <span className="aspect-square rounded-400 bg-gray-200" />
            <span className="flex aspect-square items-center justify-center rounded-400 border border-dashed border-gray-300 text-hint">
              <Plus size={16} aria-hidden />
            </span>
          </Grid>
          <HStack gap="100">
            <Button variant="outline" size="sm" className="flex-1">
              이전
            </Button>
            <Button size="sm" className="flex-1">
              다음
            </Button>
          </HStack>
        </VStack>
      </Card.Root>
    );
  }

  return (
    <Card.Root padding="none" className="w-[298px] p-175 shadow-lg">
      <VStack gap="175">
        <HStack align="center" gap="150">
          <Avatar name="라온" size="lg" />
          <VStack gap="025" className="min-w-0">
            <Text typography="subtitle1" weight="extrabold" render={<span />}>
              라온
            </Text>
            <Text typography="body4" foreground="hint" render={<span />}>
              호러와 조사물을 주로 굴립니다
            </Text>
          </VStack>
        </HStack>
        <VStack gap="075">
          <ProfileLinks links={SAMPLE_LINKS} />
          <HStack
            align="center"
            gap="100"
            className="rounded-400 border border-dashed border-gray-300 px-125 py-100 text-hint"
          >
            <Plus size={15} aria-hidden />
            <Text typography="body4" weight="bold" render={<span />}>
              링크 추가
            </Text>
          </HStack>
        </VStack>
      </VStack>
    </Card.Root>
  );
}
