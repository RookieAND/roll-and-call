"use client";

import { Avatar, Badge, HStack, SegmentedControl, Text, VStack } from "@roll-and-call/ui";

import { ATTENDANCE_CHOICE, ATTENDANCE_OPTIONS } from "../model/attendance-choice";
import { attendanceRowLine } from "../model/attendance-row-line";
import type { Attendee } from "../model/attendee";
import { AttendanceRowNote } from "./attendance-row-note";

interface AttendanceRowProps {
  attendee: Attendee;
  absent: boolean;
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
  const editable = !readOnly && !attendee.staffAdded;
  const line = attendanceRowLine({ attendee, absent, editable });

  return (
    <VStack>
      <HStack align="center" gap="125" className="min-h-16 px-150 py-125">
        <Avatar src={attendee.avatarUrl} name={attendee.username} size="md" />
        <VStack className="min-w-0 flex-1">
          <HStack align="center" gap="075" className="min-w-0">
            <Text typography="subtitle2" truncate className="min-w-0">
              {attendee.username}
            </Text>
            {attendee.staffCancelled && (
              <Badge colorPalette="gray" className="flex-none">
                운영진 취소
              </Badge>
            )}
            {attendee.staffAdded && (
              <Badge colorPalette="gray" className="flex-none">
                운영진 추가
              </Badge>
            )}
          </HStack>
          <Text typography="body4" foreground={line.foreground} truncate>
            {line.text}
          </Text>
        </VStack>
        <SegmentedControl.Root
          size="sm"
          disabled={!editable}
          aria-label={`${attendee.username} 참석 여부`}
          value={choice}
          onValueChange={(next) => onChange?.(next === ATTENDANCE_CHOICE.absent)}
          className="w-32 flex-none"
        >
          {ATTENDANCE_OPTIONS.map((option) => (
            <SegmentedControl.Item
              key={option.value}
              value={option.value}
              colorPalette={option.colorPalette}
            >
              {option.label}
            </SegmentedControl.Item>
          ))}
        </SegmentedControl.Root>
      </HStack>
      {editable && <AttendanceRowNote attendee={attendee} absent={absent} />}
    </VStack>
  );
}
