"use client";

import { Button, Calendar, HStack, Popover, Text, VStack, toast } from "@roll-and-call/ui";
import { CalendarDays } from "lucide-react";
import { useState, useTransition } from "react";

import { formatDate } from "@/shared/lib";
import { FactRows, Tag } from "@/shared/ui";

import { changeEnforcementDate } from "../api/change-enforcement-date";
import { formatEnforcementDate } from "../model/format-enforcement-date";
import { toSeoulDateKey } from "../model/to-seoul-date-key";
import { DateShiftPreview } from "./date-shift-preview";
import { EnforcementScope } from "./enforcement-scope";

interface EnforcementDateFormProps {
  enforcementDate: Date | null;
}

export function EnforcementDateForm({ enforcementDate }: EnforcementDateFormProps) {
  const [pending, startTransition] = useTransition();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [picked, setPicked] = useState<Date | null>(null);

  const current = enforcementDate ? formatEnforcementDate(enforcementDate) : null;
  const dateKey = picked ? toSeoulDateKey(picked) : undefined;
  const changeLabel = enforcementDate ? "적용일 변경" : "적용일 설정";
  const isPostpone = Boolean(enforcementDate && picked && picked > enforcementDate);

  const pickDate = (key: string) => {
    setCalendarOpen(false);
    setPicked(new Date(`${key}T00:00:00+09:00`));
  };

  const confirm = () =>
    startTransition(async () => {
      if (!picked) return;
      await changeEnforcementDate(picked, isPostpone ? "postpone" : "set");
      toast.success(`적용일을 ${formatDate(picked)}로 ${isPostpone ? "연기" : "지정"}했습니다`);
      setPicked(null);
    });

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
