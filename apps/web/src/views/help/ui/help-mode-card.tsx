import { Card, HStack, Text, VStack } from "@roll-and-call/ui";
import { Dice5, Zap } from "lucide-react";

import { RECRUIT_METHOD, recruitMethodLabel } from "@/entities/game";
import { BrandMark } from "@/entities/profile";

import type { HelpMode } from "../model/help-docs";

interface HelpModeCardProps {
  mode: HelpMode;
}

export function HelpModeCard({ mode }: HelpModeCardProps) {
  const Icon = mode.method === RECRUIT_METHOD.lottery ? Dice5 : Zap;

  return (
    <Card.Root radius={500} padding="none" className="overflow-hidden">
      <HStack align="center" gap="150" className="px-175 pt-175 pb-150">
        <span className="flex size-[38px] flex-none items-center justify-center rounded-400 bg-tinted-bg text-tinted-ink">
          <Icon size={20} aria-hidden />
        </span>
        <VStack gap="025" className="min-w-0 flex-1">
          <Text typography="subtitle1" weight="extrabold" render={<h3 />}>
            {recruitMethodLabel(mode.method)}
          </Text>
          <Text typography="body4" foreground="muted" render={<p />}>
            {mode.summary}
          </Text>
        </VStack>
      </HStack>
      <VStack gap="125" render={<ol />} className="border-t border-gray-200 px-175 pt-150 pb-175">
        {mode.steps.map((step, index) => (
          <HStack key={step.title} align="start" gap="125" render={<li />}>
            <Text
              typography="body4"
              weight="extrabold"
              foreground="muted"
              render={<span />}
              className="mt-025 flex size-5 flex-none items-center justify-center rounded-full bg-gray-100 tabular-nums"
            >
              {index + 1}
            </Text>
            <VStack className="min-w-0 flex-1">
              <Text typography="body3" weight="bold" render={<span />}>
                {step.title}
              </Text>
              {step.body && (
                <Text typography="body3" foreground="muted" render={<span />}>
                  {step.body}
                </Text>
              )}
            </VStack>
          </HStack>
        ))}
      </VStack>
      {mode.foot && (
        <HStack
          align="start"
          gap="125"
          className="border-t border-gray-200 bg-gray-50 px-175 py-150"
        >
          <span className="mt-050 flex-none text-discord">
            <BrandMark service="discord" size={16} />
          </span>
          <Text
            typography="body3"
            foreground="muted"
            render={<p />}
            className="min-w-0 flex-1 text-pretty"
          >
            {mode.foot}
          </Text>
        </HStack>
      )}
    </Card.Root>
  );
}
