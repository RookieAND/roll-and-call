"use client";

import {
  Avatar,
  Badge,
  HStack,
  SegmentedControl,
  Text,
  TextInput,
  VStack,
} from "@roll-and-call/ui";

import { EMPTY_BIO_TEXT } from "@/entities/profile";

import { ABSENCE_REASON_MAX_LENGTH } from "../model/absences-error";
import { ATTENDANCE_CHOICE, ATTENDANCE_OPTIONS } from "../model/attendance-choice";
import type { Attendee } from "../model/attendee";
import { AttendanceRowNote } from "./attendance-row-note";

interface AttendanceRowProps {
  attendee: Attendee;
  absent: boolean;
  readOnly?: boolean;
  reason?: string;
  onChange?: (absent: boolean) => void;
  onReasonChange?: (reason: string) => void;
}

export function AttendanceRow({
  attendee,
  absent,
  readOnly = false,
  reason = "",
  onChange,
  onReasonChange,
}: AttendanceRowProps) {
  const choice = absent ? ATTENDANCE_CHOICE.absent : ATTENDANCE_CHOICE.present;
  const editable = !readOnly && !attendee.staffAdded;
  const showsReason = editable && absent;

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
          <Text typography="body4" foreground="hint" truncate>
            {attendee.bio || EMPTY_BIO_TEXT}
          </Text>
          {attendee.removed && (
            <Text typography="body4" foreground="hint">
              세션 중 불참으로 내보냈습니다.
            </Text>
          )}
          {editable && absent && !attendee.staffCancelled && (
            <Text typography="body4" foreground="danger">
              불참으로 기록됩니다
            </Text>
          )}
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
      {showsReason && (
        <VStack className="px-150 pb-125">
          <TextInput
            value={reason}
            maxLength={ABSENCE_REASON_MAX_LENGTH}
            placeholder="사유(선택) · 운영진만 봅니다"
            aria-label={`${attendee.username} 불참 사유`}
            onChange={(event) => onReasonChange?.(event.target.value)}
          />
        </VStack>
      )}
    </VStack>
  );
}
