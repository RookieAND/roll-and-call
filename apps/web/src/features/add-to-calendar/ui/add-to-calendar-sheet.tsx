"use client";

import { Callout, Card, Sheet, Text, VStack } from "@roll-and-call/ui";
import { useState } from "react";

import { plannedEndAt } from "@/entities/game";
import { useServerPath } from "@/shared/lib";
import { toast } from "@/shared/ui";

import { downloadIcs } from "../api/download-ics";
import { calendarEvent } from "../model/calendar-event";
import { googleCalendarUrl } from "../model/google-calendar-url";
import { sessionRangeText } from "../model/session-range-text";
import { CalendarOptionRow } from "./calendar-option-row";
import { CalendarSummaryRow } from "./calendar-summary-row";

export interface AddToCalendarSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gameId: string;
  title: string;
  rule: string;
  gmNickname: string;
  startsAt: Date;
  playMinutes: number | null;
}

export function AddToCalendarSheet({
  open,
  onOpenChange,
  gameId,
  title,
  rule,
  gmNickname,
  startsAt,
  playMinutes,
}: AddToCalendarSheetProps) {
  const toServerPath = useServerPath();
  const [downloading, setDownloading] = useState(false);
  const [failed, setFailed] = useState(false);
  const endsAt = plannedEndAt({ confirmedAt: startsAt, playMinutes }) ?? startsAt;

  function changeOpen(nextOpen: boolean) {
    if (nextOpen) setFailed(false);
    onOpenChange(nextOpen);
  }

  function openGoogleCalendar() {
    const event = calendarEvent({
      title,
      rule,
      gmNickname,
      startsAt,
      playMinutes,
      gameUrl: window.location.origin + toServerPath(`/games/${gameId}`),
    });
    window.open(googleCalendarUrl(event), "_blank", "noopener");
    changeOpen(false);
  }

  async function downloadFile() {
    setDownloading(true);
    setFailed(false);
    try {
      await downloadIcs({
        url: toServerPath(`/games/${gameId}/calendar.ics`),
        fileName: `roll-and-call-${gameId}.ics`,
      });
      changeOpen(false);
      toast.success("캘린더 파일을 내려받았습니다");
    } catch {
      setFailed(true);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <Sheet.Root open={open} onOpenChange={changeOpen}>
      <Sheet.Popup>
        <Sheet.Handle />
        <Sheet.Title>캘린더에 추가</Sheet.Title>
        <VStack gap="175">
          {failed && (
            <Callout.Root colorPalette="danger" size="sm">
              <Callout.Icon />
              <div>
                <Callout.Title>캘린더 파일을 만들지 못했습니다.</Callout.Title>
                <Callout.Description>잠시 뒤 다시 시도해 주세요.</Callout.Description>
              </div>
            </Callout.Root>
          )}
          <Card.Root
            radius={500}
            background="subtle"
            padding="none"
            className="divide-y divide-gray-100 overflow-hidden"
          >
            <CalendarSummaryRow label="구인" value={title} />
            <CalendarSummaryRow label="세션 일정" value={sessionRangeText({ startsAt, endsAt })} />
          </Card.Root>
          <Card.Root radius={500} padding="none" className="overflow-hidden">
            <CalendarOptionRow
              iconSrc="/brand/google-calendar.png"
              name="구글 캘린더"
              description="새 창에서 열립니다"
              onClick={openGoogleCalendar}
            />
            <CalendarOptionRow
              iconSrc="/brand/icloud-calendar.png"
              name="iCloud 캘린더"
              description=".ics 파일을 내려받습니다"
              disabled={downloading}
              onClick={downloadFile}
            />
          </Card.Root>
          <Text typography="body4" foreground="hint" render={<p />}>
            세션 시간이 바뀌면 캘린더 일정은 직접 고쳐 주세요.
            <br />
            구인이 취소되어도 캘린더에서는 지워지지 않습니다.
          </Text>
        </VStack>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
