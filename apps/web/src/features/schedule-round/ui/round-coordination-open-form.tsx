"use client";

import { roundCoordinationError } from "@roll-and-call/database/games/model";
import { Button, Field, HStack, Text, VStack } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { DatePicker, toast, toastActionError, useAction } from "@/shared/ui";

import { openRoundCoordination } from "../api/open-round-coordination";
import { WINDOW_START_OPTIONS, windowEndOptions } from "../model/window-hour-options";
import { RoundWindowHourSelect } from "./round-window-hour-select";

interface RoundCoordinationOpenFormProps {
  gameId: string;
  roundNo: number;
  rescheduling: boolean;
  today: string;
  defaultStart: string;
  defaultEnd: string;
  defaultStartHour: number;
  defaultEndHour: number;
}

// 가능 시간 모으기를 여는 폼(2C·3C). 요청한 뒤에는 같은 화면에서 현황으로 바뀐다.
export function RoundCoordinationOpenForm({
  gameId,
  roundNo,
  rescheduling,
  today,
  defaultStart,
  defaultEnd,
  defaultStartHour,
  defaultEndHour,
}: RoundCoordinationOpenFormProps) {
  const router = useRouter();
  const { pending, run } = useAction();
  const [start, setStart] = useState(defaultStart);
  const [end, setEnd] = useState(defaultEnd);
  const [startHour, setStartHour] = useState(String(defaultStartHour));
  const [endHour, setEndHour] = useState(String(defaultEndHour));

  const dateError = start && end ? roundCoordinationError({ start, end, today }) : null;
  const descriptions = rescheduling
    ? [
        "지금 일정은 그대로 두고 가능 시간을 다시 모읍니다.",
        "조율이 끝나기 전에는 원래 일정이 유지됩니다.",
      ]
    : [
        "참여자가 가능한 시간을 칠하면 겹치는 시간을 보여 드립니다.",
        "확정된 참여자만 칠할 수 있습니다.",
      ];

  function changeStartHour(next: string) {
    setStartHour(next);
    // 끝은 시작 + 1~23시간이라 같은 값만 다음 시각으로 민다.
    if (next === endHour) setEndHour(String((Number(next) + 1) % 24));
  }

  function submit() {
    run(
      () =>
        openRoundCoordination({
          gameId,
          roundNo,
          start,
          end,
          windowStartHour: Number(startHour),
          windowEndHour: Number(endHour),
        }),
      {
        onSuccess: () => {
          toast.success(`${roundNo}회차 가능 시간을 요청했습니다.`);
          router.refresh();
        },
        onError: toastActionError,
      },
    );
  }

  return (
    <VStack gap="200">
      <VStack gap="025">
        {descriptions.map((line) => (
          <Text key={line} typography="body3" foreground="muted">
            {line}
          </Text>
        ))}
      </VStack>
      <Field.Root label="시작" htmlFor="coordinationStart" required>
        <DatePicker id="coordinationStart" value={start} min={today} onChange={setStart} />
      </Field.Root>
      <Field.Root label="끝" htmlFor="coordinationEnd" required error={dateError ?? undefined}>
        <DatePicker
          id="coordinationEnd"
          value={end}
          min={start || today}
          invalid={Boolean(dateError)}
          onChange={setEnd}
        />
      </Field.Root>
      <Field.Root label="시간대" htmlFor="coordinationStartHour" required>
        <HStack align="center" gap="100">
          <div className="min-w-0 flex-1">
            <RoundWindowHourSelect
              id="coordinationStartHour"
              label="시간대 시작 시각"
              items={WINDOW_START_OPTIONS}
              value={startHour}
              onChange={changeStartHour}
            />
          </div>
          <Text foreground="hint" aria-hidden>
            ~
          </Text>
          <div className="min-w-0 flex-1">
            <RoundWindowHourSelect
              id="coordinationEndHour"
              label="시간대 끝 시각"
              items={windowEndOptions(Number(startHour))}
              value={endHour}
              onChange={setEndHour}
            />
          </div>
        </HStack>
      </Field.Root>
      <Button
        size="lg"
        className="w-full"
        disabled={!start || !end || Boolean(dateError)}
        loading={pending}
        onClick={submit}
      >
        가능 시간 요청하기
      </Button>
    </VStack>
  );
}
