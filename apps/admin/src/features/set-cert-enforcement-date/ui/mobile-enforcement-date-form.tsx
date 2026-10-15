"use client";

import { Button, Calendar, HStack, Sheet, Text, VStack } from "@roll-and-call/ui";
import { CalendarDays } from "lucide-react";

import { KeyValueList, Tag } from "@/shared/ui";

import { formatEnforcementDate } from "../model/format-enforcement-date";
import { shiftLabel } from "../model/shift-label";
import { toSeoulDateKey } from "../model/to-seoul-date-key";
import { EnforcementScope } from "./enforcement-scope";
import { useEnforcementDate } from "./use-enforcement-date";

interface MobileEnforcementDateFormProps {
  enforcementDate: Date | null;
}

// 항목을 카드로 쌓고, 날짜는 아래에서 올라오는 시트의 달력에서 고른다. [변경]은 화면 아래에 고정한다.
export function MobileEnforcementDateForm({ enforcementDate }: MobileEnforcementDateFormProps) {
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
  const shift =
    picked && enforcementDate ? shiftLabel({ from: enforcementDate, to: picked }) : null;

  return (
    <>
      <VStack gap="150" className="w-full flex-1 px-150 pt-150 pb-200">
        <VStack gap="075" className="rounded-600 border border-gray-200 bg-surface px-175 py-150">
          <Text typography="body4" foreground="hint">
            현재 적용일
          </Text>
          <HStack align="center" gap="100" wrap>
            <Text typography="heading2" render={<span />}>
              {current ? current.label : "설정 안 됨"}
            </Text>
            <Tag tone={current ? "primary" : "success"}>
              {current ? current.remaining : "적용 중"}
            </Tag>
          </HStack>
          <Text typography="body4" foreground="muted" className="break-keep">
            {current
              ? "이 날짜 전까지는 인증이 필요한 룰북도 인증 없이 구인을 열 수 있습니다."
              : "인증이 필요한 룰북은 인증을 받아야 구인을 열 수 있습니다."}
          </Text>
        </VStack>
        <VStack gap="100" className="rounded-600 border border-gray-200 bg-surface px-175 py-150">
          <Text typography="subtitle1" render={<h2 />}>
            {changeLabel}
          </Text>
          <Sheet.Root open={calendarOpen} onOpenChange={setCalendarOpen}>
            <Sheet.Trigger
              disabled={pending}
              render={
                <Button
                  variant="outline"
                  colorPalette="gray"
                  aria-label="적용일 선택"
                  className="min-h-12 w-full justify-start gap-100"
                />
              }
            >
              <CalendarDays size={16} aria-hidden />
              {picked ? formatEnforcementDate(picked).label : "날짜 선택"}
            </Sheet.Trigger>
            <Sheet.Popup className="px-200 pt-100">
              <Sheet.Handle />
              <Sheet.Title className="text-heading3">적용일 선택</Sheet.Title>
              <Calendar value={dateKey} min={toSeoulDateKey(new Date())} onSelect={pickDate} />
            </Sheet.Popup>
          </Sheet.Root>
          <Text typography="body4" foreground="hint">
            오늘 이후 날짜만 고를 수 있습니다.
          </Text>
          {picked && enforcementDate ? (
            <VStack
              gap="075"
              className="rounded-400 border border-gray-200 bg-gray-50 px-150 py-100"
            >
              <KeyValueList
                columns={2}
                items={[
                  { label: "현재", value: formatEnforcementDate(enforcementDate).label },
                  { label: "변경 후", value: formatEnforcementDate(picked).label },
                ]}
              />
              {shift ? <Tag tone="warning">{shift}</Tag> : null}
            </VStack>
          ) : null}
        </VStack>
        <VStack gap="100" className="rounded-600 border border-gray-200 bg-surface px-175 py-150">
          <Text typography="subtitle1" render={<h2 />}>
            영향 범위
          </Text>
          <EnforcementScope />
        </VStack>
      </VStack>
      <VStack className="sticky bottom-0 z-(--rc-z-sticky) mt-auto border-t border-gray-200 bg-surface px-150 pt-125 pb-[calc(var(--spacing-150)+var(--rc-safe-bottom))]">
        <Button
          disabled={!picked || pending}
          loading={pending}
          onClick={confirm}
          className="min-h-12 w-full"
        >
          변경
        </Button>
      </VStack>
    </>
  );
}
