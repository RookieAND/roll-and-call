import { cn, HStack, Text, VStack } from "@roll-and-call/ui";

import { BadgeMedal } from "@/entities/badge";

import type { FeaturedChoice } from "../model/featured-choice";

interface FeaturedPickRowProps {
  choice: FeaturedChoice;
  order: number;
  disabled: boolean;
  onToggle: () => void;
}

export function FeaturedPickRow({ choice, order, disabled, onToggle }: FeaturedPickRowProps) {
  const selected = order >= 0;
  return (
    <HStack
      render={<button type="button" aria-pressed={selected} onClick={onToggle} />}
      align="center"
      gap="150"
      className={cn(
        "w-full cursor-pointer px-175 py-125 text-left not-first:border-t not-first:border-gray-200",
        selected && "bg-primary-50",
        disabled && "opacity-45",
      )}
    >
      <BadgeMedal emoji={choice.emoji} look={choice.look} size="row" />
      <VStack gap="025" className="min-w-0 flex-1">
        <Text typography="subtitle2" weight="extrabold" className="break-keep">
          {choice.name}
        </Text>
        <Text typography="body4" foreground="hint" className="break-keep">
          {choice.requirement}
        </Text>
      </VStack>
      {selected && (
        <Text
          typography="body4"
          weight="extrabold"
          foreground="onPrimary"
          numeric
          aria-label="대표 뱃지 순서"
          className="flex size-6 flex-none items-center justify-center rounded-full bg-primary-600"
        >
          {order + 1}
        </Text>
      )}
    </HStack>
  );
}
