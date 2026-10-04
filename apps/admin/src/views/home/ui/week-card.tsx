import { HStack, Text, VStack } from "@roll-and-call/ui";
import type { LucideIcon } from "lucide-react";

import { deltaArrow } from "@/shared/lib";
import type { WeeklySeries } from "@/shared/server";

import { WeekChart } from "./week-chart";

interface WeekCardProps {
  label: string;
  icon: LucideIcon;
  unit: string;
  series: WeeklySeries;
  currentLabel: string;
}

export function WeekCard({ label, icon: Icon, unit, series, currentLabel }: WeekCardProps) {
  const { current, previous, delta, deltaPercent } = series;
  const arrow = deltaArrow(delta);
  const deltaForeground = delta < 0 ? "danger" : "normal";
  const percentText = `(${delta > 0 ? "+" : ""}${deltaPercent}%)`;
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
      </HStack>
      <HStack align="end" gap="150">
        <Text
          typography="heading1"
          weight="extrabold"
          numeric
          className="leading-none tracking-[-0.02em] whitespace-nowrap"
        >
          {current}
          <Text typography="subtitle1" className="ml-050 tracking-normal">
            {unit}
          </Text>
        </Text>
        <VStack gap="025" className="pb-025 whitespace-nowrap">
          <Text
            typography="body3"
            weight="bold"
            foreground={deltaForeground}
            numeric
            className="leading-[1.2]"
          >
            {arrow} {Math.abs(delta)}
            {unit}{" "}
            <Text weight="regular" foreground="muted" className="font-medium">
              {percentText}
            </Text>
          </Text>
          <Text typography="body4" foreground="hint" className="leading-[1.2]">
            지난 7일 {previous}
            {unit} 대비
          </Text>
        </VStack>
      </HStack>
      <WeekChart
        weeks={series.weeks}
        currentLabel={currentLabel}
        average={series.average}
        name={label}
        unit={unit}
      />
    </VStack>
  );
}
