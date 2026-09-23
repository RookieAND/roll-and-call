"use client";

import { Button, Card, FloatingBar, HStack, Text, VStack } from "@roll-and-call/ui";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { WEEKDAY_LABELS, type AvailabilityInterval } from "@/entities/profile";
import { AppBar, toast, useAction } from "@/shared/ui";

import { updateAvailability } from "../api/update-availability";
import { addInterval, removeAt, removeDay, setHour } from "../model/availability-draft";
import { overlappingIntervals } from "../model/overlapping-intervals";
import { AvailabilityDayEditor } from "./availability-day-editor";

interface AvailabilityEditorProps {
  defaultValue: AvailabilityInterval[];
}

export function AvailabilityEditor({ defaultValue }: AvailabilityEditorProps) {
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

      <div className="border-b border-gray-200 px-200 py-175">
        <Card.Root radius={400} background="subtle" padding="none" className="px-150 py-150">
          <Text typography="body4" foreground="muted" render={<p />} className="leading-[1.65]">
            되는 요일만 켜고 시간을 정합니다.
            <br />
            여기서 정한 값이 일정 조율 격자에 미리 칠해집니다.
          </Text>
        </Card.Root>
      </div>

      <VStack gap="100" className="px-200 py-200">
        <HStack align="baseline" gap="100">
          <Text weight="bold" typography="body4" className="flex-none">
            요일마다
          </Text>
          <Text typography="body4" foreground="hint" className="flex-1">
            요일을 눌러 켜고 끕니다
          </Text>
          <Text typography="body4" foreground="hint">
            1시간 단위
          </Text>
        </HStack>

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

      <FloatingBar.Root elevated={false}>
        <FloatingBar.Content>
          <HStack gap="100" className="[&>*]:flex-1">
            <Button variant="outline" size="lg" onClick={() => router.push("/me/edit")}>
              취소
            </Button>
            <Button size="lg" loading={pending} disabled={conflicts.size > 0} onClick={save}>
              저장
            </Button>
          </HStack>
        </FloatingBar.Content>
        <FloatingBar.Spacer />
      </FloatingBar.Root>
    </>
  );
}
