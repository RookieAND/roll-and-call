"use client";

import { Button, Text, VStack } from "@trpg/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { WEEKDAY_LABELS, type AvailabilityInterval } from "@/entities/profile";
import { AppBar, toast, useAction } from "@/shared/ui";

import { updateAvailability } from "../api/update-availability";
import { addInterval, removeAt, removeDay, setHour } from "../model/availability-draft";
import { AvailabilityDayEditor } from "./availability-day-editor";

export function AvailabilityEditor({ defaultValue }: { defaultValue: AvailabilityInterval[] }) {
  const router = useRouter();
  const [intervals, setIntervals] = useState(defaultValue);
  const { pending, run } = useAction();

  function save() {
    run(() => updateAvailability(intervals), {
      onSuccess: () => toast.success("가능 시간대를 저장했습니다"),
    });
  }

  return (
    <>
      <AppBar
        back="/me/edit"
        title="가능 시간대"
        action={
          <Button variant="ghost" className="h-9 text-primary-ink" loading={pending} onClick={save}>
            저장
          </Button>
        }
      />

      <div className="border-b border-gray-200 px-4 py-3.5">
        <div className="rounded-[11px] border border-gray-200 bg-gray-50 px-3 py-[11px]">
          <Text typography="body4" foreground="muted" render={<p />} className="leading-[1.65]">
            보통 되는 요일과 시간을 요일마다 따로 정합니다. 안 되는 요일은 비워두면 됩니다.
            <br />
            여기서 정한 값이 일정 조율 격자에 미리 칠해집니다.
          </Text>
        </div>
      </div>

      <VStack gap={2} className="px-4 py-4">
        <div className="flex items-baseline gap-2">
          <Text typography="subtitle2" className="flex-1 text-[12.5px]">
            요일마다
          </Text>
          <Text typography="body4" foreground="hint">
            1시간 단위
          </Text>
        </div>

        {WEEKDAY_LABELS.map((label, day) => {
          const rows = intervals
            .map((interval, index) => ({ index, interval }))
            .filter((row) => row.interval.day === day);

          return (
            <AvailabilityDayEditor
              key={label}
              label={label}
              rows={rows}
              onToggle={() =>
                setIntervals(
                  rows.length > 0 ? removeDay(intervals, day) : addInterval(intervals, day),
                )
              }
              onAdd={() => setIntervals(addInterval(intervals, day))}
              onRemove={(index) => setIntervals(removeAt(intervals, index))}
              onHourChange={(index, edge, hour) =>
                setIntervals(setHour(intervals, index, edge, hour))
              }
            />
          );
        })}

        <Text typography="body4" foreground="hint" render={<p />} className="leading-[1.65]">
          요일 칩을 누르면 그 날을 켜고 끕니다. ＋는 그 요일에 구간을 하나 더 넣습니다.
          <br />
          저장되는 단위도 요일 하나당 구간 목록입니다.
        </Text>

        <Button
          variant="outline"
          size="lg"
          className="mt-2 h-[50px]"
          onClick={() => router.push("/me/edit")}
        >
          취소
        </Button>
      </VStack>
    </>
  );
}
