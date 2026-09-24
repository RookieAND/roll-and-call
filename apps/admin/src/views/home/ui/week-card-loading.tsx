import { Button, HStack, Skeleton, Text, VStack } from "@roll-and-call/ui";
import type { LucideIcon } from "lucide-react";

const BAR_HEIGHTS = [58, 66, 52, 72, 62, 80, 70, 92];

interface WeekCardLoadingProps {
  label: string;
  icon: LucideIcon;
  linkLabel: string;
}

export function WeekCardLoading({ label, icon: Icon, linkLabel }: WeekCardLoadingProps) {
  return (
    <VStack
      gap="100"
      render={<section aria-label={label} />}
      className="min-w-0 rounded-600 border border-gray-200 bg-surface px-175 pt-150 pb-100"
    >
      <HStack align="center" gap="075">
        <Icon size={14} aria-hidden className="text-hint" />
        <Text typography="body4" weight="bold" foreground="muted" render={<h2 />}>
          {label}
        </Text>
        <Button variant="outline" size="sm" disabled className="ml-auto">
          {linkLabel}
        </Button>
      </HStack>
      <HStack align="end" gap="150">
        <Skeleton width={88} height={44} rounded={300} />
        <VStack gap="050" className="pb-025">
          <Skeleton width={96} height={14} />
          <Skeleton width={80} height={12} />
        </VStack>
      </HStack>
      <VStack className="h-[150px]">
        <HStack align="end" gap="150" className="flex-1 px-100 pt-250">
          {BAR_HEIGHTS.map((height, index) => (
            <HStack key={index} justify="center" className="min-w-0 flex-1">
              <Skeleton width="100%" height={height} rounded={300} className="max-w-[36px]" />
            </HStack>
          ))}
        </HStack>
        <div className="h-[24px] border-t border-gray-200" />
      </VStack>
    </VStack>
  );
}
