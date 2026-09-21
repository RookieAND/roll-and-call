"use client";

import { Avatar, HStack, SegmentControl, Text, VStack } from "@trpg/ui";

import {
  ATTENDANCE_CHOICE,
  ATTENDANCE_OPTIONS,
  type AttendanceChoice,
} from "../model/attendance-choice";
import type { Attendee } from "../model/attendee";
import { AbsentNotice } from "./absent-notice";

interface AttendanceRowProps {
  attendee: Attendee;
  absent: boolean;
  // 확정 뒤에는 같은 줄을 읽기만 한다. 고치려면 "다시 고치기"로 연다.
  readOnly?: boolean;
  onChange?: (absent: boolean) => void;
}

export function AttendanceRow({
  attendee,
  absent,
  readOnly = false,
  onChange,
}: AttendanceRowProps) {
  const choice = absent ? ATTENDANCE_CHOICE.absent : ATTENDANCE_CHOICE.present;
  const showNotice = absent && !readOnly;

  return (
    <HStack
      align="center"
      gap="125"
      className="min-h-15 border-t border-gray-100 px-150 py-125 first:border-t-0"
    >
      <Avatar src={attendee.avatarUrl} name={attendee.username} size="md" />
      <VStack gap="025" className="min-w-0 flex-1">
        <Text truncate typography="subtitle2">
          {attendee.username}
        </Text>
        {showNotice && <AbsentNotice />}
      </VStack>
      <SegmentControl
        fill
        disabled={readOnly}
        aria-label={`${attendee.username} 참석 여부`}
        options={ATTENDANCE_OPTIONS}
        value={choice}
        onChange={(next: AttendanceChoice) => onChange?.(next === ATTENDANCE_CHOICE.absent)}
        className="w-[138px] flex-none"
      />
    </HStack>
  );
}
