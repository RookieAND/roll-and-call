import { Text } from "@trpg/ui";

import { GAME_STATUS, GameStatusBadge } from "@/entities/game";
import { ProfileLinks } from "@/entities/profile";

import type { OnboardingSlide } from "../model/onboarding-slides";

const HEAT_STEPS = [0, 1, 0, 2, 1, 1, 2, 1, 4, 2, 2, 4, 2, 5, 3, 0, 1, 0, 2, 1];
const WIZARD_STEPS = [1, 2, 3, 4];
const SAMPLE_LINKS = [
  { service: "discord", value: "raon" },
  { service: "x", value: "@raon" },
];

// ponytail: 온보딩 그림 자리는 실제 화면을 축소한 장식이라 상호작용이 없다. 누를 수 있는 것처럼 보이는 조각도 span이다.
export function OnboardingPreview({ slideKey }: { slideKey: OnboardingSlide["key"] }) {
  if (slideKey === "find") {
    return (
      <div className="w-[262px] overflow-hidden rounded-[13px] border border-gray-200 bg-surface">
        <div className="flex h-[70px] items-end bg-tinted-bg p-2">
          <GameStatusBadge status={GAME_STATUS.recruiting} />
        </div>
        <div className="flex flex-col gap-2 p-3">
          <Text typography="heading3" render={<span />}>
            물벼락 — 1부
          </Text>
          <Text typography="body4" foreground="muted" render={<span />}>
            GM 라온 · 크툴루의 부름 · 3시간
          </Text>
          <span className="flex h-9 items-center justify-center rounded-[10px] bg-primary-600">
            <Text typography="subtitle1" render={<span />} className="text-white">
              신청하기
            </Text>
          </span>
        </div>
      </div>
    );
  }

  if (slideKey === "schedule") {
    return (
      <div className="flex w-[262px] flex-col gap-2.5 rounded-[13px] border border-gray-200 bg-surface p-3">
        <div className="grid grid-cols-5 gap-1">
          {HEAT_STEPS.map((step, index) => (
            <span
              key={index}
              className="h-6 rounded-[5px] border border-gray-100"
              style={{ backgroundColor: `var(--color-heat-${step})` }}
            />
          ))}
        </div>
        <div className="flex items-center gap-2 border-t border-gray-100 pt-2.5">
          <Text typography="body4" foreground="muted" render={<span />}>
            적음
          </Text>
          <span
            className="h-[7px] flex-1 rounded"
            style={{
              backgroundImage:
                "linear-gradient(90deg, var(--color-heat-1), var(--color-heat-3), var(--color-heat-5))",
            }}
          />
          <Text typography="body4" foreground="muted" render={<span />}>
            모두 가능
          </Text>
        </div>
      </div>
    );
  }

  if (slideKey === "host") {
    return (
      <div className="flex w-[262px] flex-col gap-3 rounded-[13px] border border-gray-200 bg-surface p-3.5">
        <div className="flex items-center">
          {WIZARD_STEPS.map((step) => {
            const done = step <= 3;
            return (
              <span key={step} className="flex flex-1 items-center last:flex-none">
                <Text
                  typography="subtitle2"
                  render={<span />}
                  className={
                    done
                      ? "flex size-[22px] flex-none items-center justify-center rounded-[7px] bg-primary-600 text-white tabular-nums"
                      : "flex size-[22px] flex-none items-center justify-center rounded-[7px] bg-gray-100 text-hint tabular-nums"
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
        </div>
        <Text typography="subtitle1" render={<span />}>
          이미지
        </Text>
        <div className="grid grid-cols-3 gap-2">
          <span className="aspect-square rounded-[9px] bg-tinted-bg" />
          <span className="aspect-square rounded-[9px] bg-gray-100" />
          <span className="aspect-square rounded-[9px] border border-dashed border-gray-300" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-[262px] flex-col gap-3 rounded-[13px] border border-gray-200 bg-surface p-3.5">
      <div className="flex items-center gap-2.5">
        <span className="size-11 flex-none rounded-full bg-tinted-bg" />
        <div className="min-w-0">
          <Text typography="subtitle1" render={<span />} className="block">
            라온
          </Text>
          <Text typography="body4" foreground="muted" render={<span />} className="mt-0.5 block">
            호러와 조사물을 주로 굴립니다
          </Text>
        </div>
      </div>
      <ProfileLinks links={SAMPLE_LINKS} />
    </div>
  );
}
