"use client";

import {
  Button,
  Calendar,
  Field,
  HStack,
  Popover,
  Select,
  Text,
  VStack,
  toast,
} from "@roll-and-call/ui";
import { CalendarDays } from "lucide-react";
import { useState, useTransition } from "react";

import { formatDate } from "@/shared/lib";

import { changeEnforcementDate } from "../api/change-enforcement-date";
import { POSTPONE_OPTIONS } from "../model/postpone-options";
import { toSeoulDateKey } from "../model/to-seoul-date-key";
import { ConfirmDateChangeDialog } from "./confirm-date-change-dialog";

const DAY = 86_400_000;

interface EnforcementDateFormProps {
  enforcementDate: Date | null;
}

export function EnforcementDateForm({ enforcementDate }: EnforcementDateFormProps) {
  const [pending, startTransition] = useTransition();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [postponeDays, setPostponeDays] = useState<string>();

  const [change, setChange] = useState<{ date: Date; kind: "set" | "postpone" } | null>(null);

  const pickDate = (dateKey: string) => {
    setCalendarOpen(false);
    setChange({ date: new Date(`${dateKey}T00:00:00+09:00`), kind: "set" });
  };

  const pickPostpone = () =>
    enforcementDate &&
    setChange({
      date: new Date(enforcementDate.getTime() + Number(postponeDays) * DAY),
      kind: "postpone",
    });
  const dateLabel = enforcementDate ? formatDate(enforcementDate) : "지정 전";
  const dateKey = enforcementDate ? toSeoulDateKey(enforcementDate) : undefined;

  const confirm = () =>
    startTransition(async () => {
      if (!change) return;
      await changeEnforcementDate(change.date, change.kind);
      const verb = change.kind === "postpone" ? "연기했습니다" : "지정했습니다";
      toast.success(`적용일을 ${formatDate(change.date)}로 ${verb}`);
      setChange(null);
      setPostponeDays(undefined);
    });

  return (
    <HStack align="start" gap="150">
      <Field.Root label="적용일" htmlFor="enforcement-date" required className="flex-1">
        <Popover.Root open={calendarOpen} onOpenChange={setCalendarOpen}>
          <Popover.Trigger
            id="enforcement-date"
            disabled={pending}
            render={
              <Button
                variant="outline"
                colorPalette="gray"
                className="h-11 w-full justify-between font-normal"
              />
            }
          >
            <Text typography="body2">{dateLabel}</Text>
            <CalendarDays size={16} aria-hidden />
          </Popover.Trigger>
          <Popover.Popup align="start">
            <Calendar value={dateKey} min={toSeoulDateKey(new Date())} onSelect={pickDate} />
          </Popover.Popup>
        </Popover.Root>
      </Field.Root>
      <VStack gap="075" className="flex-1">
        <Text typography="body4" weight="bold" id="postpone-label">
          적용일 연기
        </Text>
        <HStack align="center" gap="100">
          <div className="w-[132px]">
            <Select.Root key={dateKey} items={POSTPONE_OPTIONS} onValueChange={setPostponeDays}>
              <Select.Trigger placeholder="연기 기간 선택" />
              <Select.Popup>
                {POSTPONE_OPTIONS.map((option) => (
                  <Select.Item key={option.value} value={option.value}>
                    {option.label}
                  </Select.Item>
                ))}
              </Select.Popup>
            </Select.Root>
          </div>
          <Button
            variant="outline"
            colorPalette="gray"
            size="sm"
            disabled={!enforcementDate || !postponeDays || pending}
            onClick={pickPostpone}
          >
            연기
          </Button>
        </HStack>
      </VStack>
      <ConfirmDateChangeDialog
        change={change}
        currentDate={enforcementDate}
        pending={pending}
        onCancel={() => setChange(null)}
        onConfirm={confirm}
      />
    </HStack>
  );
}
