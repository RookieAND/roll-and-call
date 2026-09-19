"use client";

import { Button, Text, VStack } from "@trpg/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { WEEKDAY_LABELS, type AvailabilityInterval } from "@/entities/profile";
import { AppBar, toast, useAction } from "@/shared/ui";

import { updateAvailability } from "../api/update-availability";
import { addInterval, removeAt, removeDay, setHour } from "../model/availability-draft";
import { overlappingIntervals } from "../model/overlapping-intervals";
import { AvailabilityDayEditor } from "./availability-day-editor";

export function AvailabilityEditor({ defaultValue }: { defaultValue: AvailabilityInterval[] }) {
  const router = useRouter();
  const [intervals, setIntervals] = useState(defaultValue);
  const { pending, run } = useAction();
  const conflicts = overlappingIntervals(intervals);

  function save() {
    run(() => updateAvailability(intervals), {
      onSuccess: () => toast.success("가능 시간대를 저장했습니다"),
    });
  }

  return (
    <>
      <AppBar back="/me/edit" title="가능 시간대" />

      <div className="border-b border-gray-200 px-4 py-3.5">
        <div className="rounded-[11px] border border-gray-200 bg-gray-50 px-3 py-[11px]">
          <Text typography="body4" foreground="muted" render={<p />} className="leading-[1.65]">
            되는 요일만 켜고 시간을 정합니다.
            <br />
            여기서 정한 값이 일정 조율 격자에 미리 칠해집니다.
          </Text>
        </div>
      </div>

      <VStack gap={2} className="px-4 py-4">
        <div className="flex items-baseline gap-2">
          <Text typography="subtitle2" className="flex-none text-[12.5px]">
            요일마다
          </Text>
          <Text typography="body4" foreground="hint" className="flex-1">
            요일을 눌러 켜고 끕니다
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
              conflicts={conflicts}
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
          ＋는 그 요일에 구간을 하나 더 넣습니다.
          <br />
          같은 요일 안에서 시간이 겹치는 구간은 담길 수 없습니다.
        </Text>
      </VStack>

      {/* ponytail: bottom-[58px]는 BottomNav 높이(h-[58px])와 결합. nav 높이 바뀌면 같이 조정. */}
      <div className="sticky bottom-[58px] z-10 border-t border-gray-200 bg-surface px-4 pt-3.5 pb-4">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="lg"
            className="h-[50px] flex-1"
            onClick={() => router.push("/me/edit")}
          >
            취소
          </Button>
          <Button
            size="lg"
            className="h-[50px] flex-1"
            loading={pending}
            disabled={conflicts.size > 0}
            onClick={save}
          >
            저장
          </Button>
        </div>
      </div>
    </>
  );
}
