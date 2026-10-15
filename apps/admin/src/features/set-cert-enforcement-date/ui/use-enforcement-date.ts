"use client";

import { toast } from "@roll-and-call/ui";
import { useState } from "react";

import { formatDate, useActionSubmit } from "@/shared/lib";

import { changeEnforcementDate } from "../api/change-enforcement-date";
import { formatEnforcementDate } from "../model/format-enforcement-date";
import { toSeoulDateKey } from "../model/to-seoul-date-key";

// 적용일 고르기·확정. 데스크톱과 모바일 폼이 같이 쓴다.
export function useEnforcementDate(enforcementDate: Date | null) {
  const { pending, submit } = useActionSubmit(changeEnforcementDate);
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

  const confirm = async () => {
    if (!picked) return;
    const result = await submit(picked, isPostpone ? "postpone" : "set");
    if (!result) {
      toast.danger("적용일을 바꾸지 못했습니다.", { description: "다시 시도해 주세요." });
      return;
    }
    toast.success(`적용일을 ${formatDate(picked)}로 ${isPostpone ? "연기" : "지정"}했습니다`);
    setPicked(null);
  };

  return {
    pending,
    calendarOpen,
    setCalendarOpen,
    picked,
    current,
    dateKey,
    changeLabel,
    pickDate,
    confirm,
  };
}
