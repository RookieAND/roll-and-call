"use client";

import { Avatar, HStack, SegmentControl, Text } from "@trpg/ui";

import {
  ATTENDANCE_CHOICE,
  ATTENDANCE_OPTIONS,
  type AttendanceChoice,
} from "../model/attendance-choice";
import type { Attendee } from "../model/attendee";

export function AttendanceRow({
  attendee,
  absent,
  onChange,
}: {
  attendee: Attendee;
  absent: boolean;
  onChange: (absent: boolean) => void;
}) {
  const choice = absent ? ATTENDANCE_CHOICE.absent : ATTENDANCE_CHOICE.present;

  return (
    <HStack
      align="center"
      gap="125"
      className="min-h-15 border-t border-gray-100 px-150 py-100 first:border-t-0"
    >
      <Avatar src={attendee.avatarUrl} name={attendee.username} size="stack" />
      <div className="min-w-0 flex-1">
        <Text truncate typography="subtitle2">
          {attendee.username}
        </Text>
        {absent && (
          <Text typography="body4" foreground="danger" className="block">
            불참으로 기록됩니다
          </Text>
        )}
      </div>
      <SegmentControl
        aria-label={`${attendee.username} 참석 여부`}
        options={ATTENDANCE_OPTIONS}
        value={choice}
        onChange={(next: AttendanceChoice) => onChange(next === ATTENDANCE_CHOICE.absent)}
      />
    </HStack>
  );
}
