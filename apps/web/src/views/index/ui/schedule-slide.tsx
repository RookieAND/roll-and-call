import { HStack, Text, VStack } from "@roll-and-call/ui";
import { CalendarDays, Check, Paintbrush } from "lucide-react";

import { MY_AVAILABLE_CELLS } from "../model/demo-heat";
import { heatBackground } from "../model/heat-background";
import { HeroHeatmap } from "./hero-heatmap";
import { PreviewCard } from "./preview-card";

const AVAILABLE_STEP = 3;

export function ScheduleSlide() {
  return (
    <>
      <PreviewCard icon={CalendarDays} title="일정 조율" aside="응답 3/4" wide>
        <HeroHeatmap />
        <HStack align="center" gap="125" className="border-t border-gray-200 pt-150">
          <Text typography="subtitle2" weight="extrabold" foreground="primary" className="flex-1">
            목 20:00 · 4명 모두 가능
          </Text>
          <Text typography="body4" weight="bold" foreground="hint">
            적음
          </Text>
          <span
            className="h-1.5 w-14 rounded-full"
            style={{
              backgroundImage:
                "linear-gradient(90deg, var(--rc-color-heat-1), var(--rc-color-heat-3), var(--rc-color-heat-5))",
            }}
          />
          <Text typography="body4" weight="bold" foreground="hint">
            많음
          </Text>
        </HStack>
      </PreviewCard>
      <PreviewCard icon={Paintbrush} title="내 가능 시간">
        <div className="grid grid-cols-4 gap-050">
          {MY_AVAILABLE_CELLS.map((available, index) => (
            <span
              key={index}
              className="h-3.5 rounded-100"
              style={{ background: heatBackground(available ? AVAILABLE_STEP : 0) }}
            />
          ))}
        </div>
        <HStack align="center" gap="075" className="text-success-700">
          <Check size={12} strokeWidth={2.8} aria-hidden />
          <Text typography="body4" weight="extrabold" foreground="success">
            6칸 저장했습니다
          </Text>
        </HStack>
      </PreviewCard>
      <PreviewCard icon={Check} title="후보 시간">
        <VStack gap="050">
          <HStack
            align="center"
            gap="100"
            className="h-8 rounded-300 bg-primary-50 px-100 shadow-[inset_0_0_0_1.5px_var(--rc-color-border-primary)]"
          >
            <span className="size-3.5 flex-none rounded-full border-4 border-primary-600 bg-surface" />
            <Text typography="body4" weight="extrabold" className="flex-1 truncate">
              목 20:00
            </Text>
            <Text typography="body4" weight="extrabold" foreground="primary" numeric>
              4명
            </Text>
          </HStack>
          <HStack align="center" gap="100" className="h-8 px-100">
            <span className="size-3.5 flex-none rounded-full border-[1.5px] border-gray-300" />
            <Text typography="body4" weight="bold" foreground="muted" className="flex-1 truncate">
              금 21:00
            </Text>
            <Text typography="body4" weight="bold" foreground="hint" numeric>
              3명
            </Text>
          </HStack>
        </VStack>
      </PreviewCard>
    </>
  );
}
