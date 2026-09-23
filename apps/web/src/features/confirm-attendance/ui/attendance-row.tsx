"use client";

import { Avatar, HStack, SegmentedControl, Text, VStack } from "@roll-and-call/ui";

import { EMPTY_BIO_TEXT } from "@/entities/profile";

import { ATTENDANCE_CHOICE, ATTENDANCE_OPTIONS } from "../model/attendance-choice";
import type { Attendee } from "../model/attendee";

interface AttendanceRowProps {
  attendee: Attendee;
  absent: boolean;
  // 확정 뒤에는 같은 줄을 읽기만 한다. 고치려면 "다시 고치기"로 연다.
  readOnly?: boolean;
  onChange?: (absent: boolean) => void;
}

// 이름 + 한 줄 소개로 사람을 가린다. 불참을 고르면 아래에 무엇이 남는지 한 줄 더 붙는다.
export function AttendanceRow({
  attendee,
  absent,
  readOnly = false,
  onChange,
}: AttendanceRowProps) {
  const choice = absent ? ATTENDANCE_CHOICE.absent : ATTENDANCE_CHOICE.present;

  return (
    <HStack align="center" gap="125" className="min-h-16 px-150 py-125">
      <Avatar src={attendee.avatarUrl} name={attendee.username} size="md" />
      <VStack className="min-w-0 flex-1">
        <Text typography="subtitle2" truncate>
          {attendee.username}
        </Text>
        <Text typography="body4" foreground="hint" truncate>
          {attendee.bio || EMPTY_BIO_TEXT}
        </Text>
        {absent && !readOnly && (
          <Text typography="body4" foreground="danger">
            불참으로 기록됩니다
          </Text>
        )}
      </VStack>
      <SegmentedControl.Root
        size="sm"
        disabled={readOnly}
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
  );
}
