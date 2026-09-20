import { Card, Grid, HStack, Text, VStack } from "@trpg/ui";

import { GAME_STATUS, GameStatusBadge } from "@/entities/game";
import { ProfileLinks } from "@/entities/profile";
import { HeatSample } from "@/shared/ui";

import type { OnboardingSlide } from "../model/onboarding-slides";

const WIZARD_STEPS = [1, 2, 3, 4];
const SAMPLE_LINKS = [
  { service: "discord", value: "raon" },
  { service: "x", value: "@raon" },
];

// ponytail: 온보딩 그림 자리는 실제 화면을 축소한 장식이라 상호작용이 없다. 누를 수 있는 것처럼 보이는 조각도 span이다.
export function OnboardingPreview({
  slideKey,
}: {
  slideKey: Exclude<OnboardingSlide["key"], "welcome">;
}) {
  if (slideKey === "find") {
    return (
      <Card radius={600} background="surface" padding="none" className="w-[262px] overflow-hidden">
        <HStack align="end" className="h-[70px] bg-tinted-bg p-100">
          <GameStatusBadge status={GAME_STATUS.recruiting} />
        </HStack>
        <VStack gap="100" className="p-150">
          <Text typography="heading3" render={<span />}>
            물벼락 — 1부
          </Text>
          <Text typography="body4" foreground="muted" render={<span />}>
            GM 라온 · 크툴루의 부름 · 3시간
          </Text>
          <span className="flex h-9 items-center justify-center rounded-400 bg-primary-600">
            <Text typography="subtitle1" render={<span />} className="text-white">
              신청하기
            </Text>
          </span>
        </VStack>
      </Card>
    );
  }

  if (slideKey === "schedule") {
    return (
      <Card radius={600} background="surface" padding="none" className="w-[262px] p-150">
        <HeatSample />
      </Card>
    );
  }

  if (slideKey === "host") {
    return (
      <VStack gap="150" className="w-[262px] rounded-600 border border-gray-200 bg-surface p-175">
        <HStack align="center">
          {WIZARD_STEPS.map((step) => {
            const done = step <= 3;
            return (
              <span key={step} className="flex flex-1 items-center last:flex-none">
                <Text
                  typography="subtitle2"
                  render={<span />}
                  className={
                    done
                      ? "flex size-[22px] flex-none items-center justify-center rounded-300 bg-primary-600 text-white tabular-nums"
                      : "flex size-[22px] flex-none items-center justify-center rounded-300 bg-gray-100 text-hint tabular-nums"
                  }
                >
                  {step}
                </Text>
                {step < WIZARD_STEPS.length && (
                  <span
                    className={done ? "h-0.5 flex-1 bg-tinted-border" : "h-0.5 flex-1 bg-gray-100"}
                  />
                )}
              </span>
            );
          })}
        </HStack>
        <Text typography="subtitle1" render={<span />}>
          이미지
        </Text>
        <Grid cols={3} gap="100">
          <span className="aspect-square rounded-400 bg-tinted-bg" />
          <span className="aspect-square rounded-400 bg-gray-100" />
          <span className="aspect-square rounded-400 border border-dashed border-gray-300" />
        </Grid>
      </VStack>
    );
  }

  return (
    <VStack gap="150" className="w-[262px] rounded-600 border border-gray-200 bg-surface p-175">
      <HStack align="center" gap="125">
        <span className="size-11 flex-none rounded-full bg-tinted-bg" />
        <div className="min-w-0">
          <Text typography="subtitle1" render={<span />} className="block">
            라온
          </Text>
          <Text typography="body4" foreground="muted" render={<span />} className="mt-025 block">
            호러와 조사물을 주로 굴립니다
          </Text>
        </div>
      </HStack>
      <ProfileLinks links={SAMPLE_LINKS} />
    </VStack>
  );
}
