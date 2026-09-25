"use client";

import { Button, Calendar, HStack, Popover, Select, toast } from "@roll-and-call/ui";
import { CalendarDays } from "lucide-react";
import { useState, useTransition } from "react";

import { formatDate } from "@/shared/lib";
import { FactRows, FactSub } from "@/shared/ui";

import { changeEnforcementDate } from "../api/change-enforcement-date";
import { formatEnforcementDate } from "../model/format-enforcement-date";
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
  const current = enforcementDate ? formatEnforcementDate(enforcementDate) : null;
  const pickLabel = enforcementDate ? "날짜 변경" : "날짜 지정";
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

  // ponytail: 시안은 현재 적용일을 읽기 전용으로 둔다. 아직 지정 전인 서비스가 날짜를 고를 길이 필요해 달력 버튼을 남겼다.
  return (
    <>
      <FactRows
        labelWidth={96}
        items={[
          {
            label: "현재 적용일",
            value: (
              <>
                {current ? current.label : "지정 전"}
                {current ? <FactSub>{current.remaining}</FactSub> : null}
                <Popover.Root open={calendarOpen} onOpenChange={setCalendarOpen}>
                  <Popover.Trigger
                    disabled={pending}
                    render={
                      <Button
                        variant="outline"
                        colorPalette="gray"
                        size="sm"
                        className="ml-auto gap-050"
                      />
                    }
                  >
                    <CalendarDays size={14} aria-hidden />
                    {pickLabel}
                  </Popover.Trigger>
                  <Popover.Popup align="end">
                    <Calendar
                      value={dateKey}
                      min={toSeoulDateKey(new Date())}
                      onSelect={pickDate}
                    />
                  </Popover.Popup>
                </Popover.Root>
              </>
            ),
          },
          {
            label: "적용일 연기",
            value: (
              <HStack align="center" gap="100">
                <div className="w-[148px] [&_[data-slot=select-trigger]]:h-[32px] [&_[data-slot=select-trigger]]:min-h-[32px]">
                  <Select.Root
                    key={dateKey}
                    items={POSTPONE_OPTIONS}
                    onValueChange={setPostponeDays}
                  >
                    <Select.Trigger placeholder="연기 기간 선택" aria-label="연기 기간" />
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
            ),
          },
        ]}
      />
      <ConfirmDateChangeDialog
        change={change}
        currentDate={enforcementDate}
        pending={pending}
        onCancel={() => setChange(null)}
        onConfirm={confirm}
      />
    </>
  );
}
