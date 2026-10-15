"use client";

import { Button, Calendar, HStack, Popover, Text, VStack } from "@roll-and-call/ui";
import { CalendarDays } from "lucide-react";

import { FactRows, Tag } from "@/shared/ui";

import { formatEnforcementDate } from "../model/format-enforcement-date";
import { toSeoulDateKey } from "../model/to-seoul-date-key";
import { DateShiftPreview } from "./date-shift-preview";
import { EnforcementScope } from "./enforcement-scope";
import { useEnforcementDate } from "./use-enforcement-date";

interface EnforcementDateFormProps {
  enforcementDate: Date | null;
}

export function EnforcementDateForm({ enforcementDate }: EnforcementDateFormProps) {
  const {
    pending,
    calendarOpen,
    setCalendarOpen,
    picked,
    current,
    dateKey,
    changeLabel,
    pickDate,
    confirm,
  } = useEnforcementDate(enforcementDate);

  return (
    <FactRows
      labelWidth={120}
      items={[
        {
          label: "현재 적용일",
          value: (
            <VStack gap="050" className="py-100">
              <HStack align="center" gap="100">
                <Text typography="heading2" render={<span />}>
                  {current ? current.label : "설정 안 됨"}
                </Text>
                <Tag tone={current ? "primary" : "success"}>
                  {current ? current.remaining : "적용 중"}
                </Tag>
              </HStack>
              <Text typography="body4" foreground="muted" weight="regular">
                {current
                  ? "이 날짜 전까지는 인증이 필요한 룰북도 인증 없이 구인을 열 수 있습니다."
                  : "인증이 필요한 룰북은 인증을 받아야 구인을 열 수 있습니다."}
              </Text>
            </VStack>
          ),
        },
        {
          label: changeLabel,
          value: (
            <VStack gap="075" className="py-100">
              <HStack align="center" gap="100">
                <Popover.Root open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <Popover.Trigger
                    disabled={pending}
                    render={
                      <Button
                        variant="outline"
                        colorPalette="gray"
                        aria-label="적용일 선택"
                        className="w-[240px] justify-start gap-100"
                      />
                    }
                  >
                    <CalendarDays size={16} aria-hidden />
                    {picked ? formatEnforcementDate(picked).label : "날짜 선택"}
                  </Popover.Trigger>
                  <Popover.Popup align="start">
                    <Calendar
                      value={dateKey}
                      min={toSeoulDateKey(new Date())}
                      onSelect={pickDate}
                    />
                  </Popover.Popup>
                </Popover.Root>
                <Button disabled={!picked || pending} onClick={confirm}>
                  변경
                </Button>
              </HStack>
              <Text typography="body4" foreground="hint" weight="regular">
                오늘 이후 날짜만 고를 수 있습니다.
              </Text>
              {picked && enforcementDate ? (
                <DateShiftPreview from={enforcementDate} to={picked} />
              ) : null}
            </VStack>
          ),
        },
        {
          label: "영향 범위",
          value: (
            <div className="py-150">
              <EnforcementScope />
            </div>
          ),
        },
      ]}
    />
  );
}
