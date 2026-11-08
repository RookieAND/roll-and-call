"use client";

import { Button, Sheet } from "@roll-and-call/ui";
import { useState, type ReactNode } from "react";

import { EndSessionDialog } from "@/features/end-session";
import { ServerLink } from "@/shared/ui";

import { AttendanceSheetItemContent } from "./attendance-sheet-item-content";

interface AttendanceRowButtonProps {
  gameId: string;
  plannedEndAt: Date;
  children: ReactNode;
}

// 진행 중인 세션의 출석 확인 줄은 선택 시트를 연다. 출석 입력은 출석 확인 화면으로, 세션 마치기는 확인 창으로 이어진다(D242).
export function AttendanceRowButton({ gameId, plannedEndAt, children }: AttendanceRowButtonProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [ending, setEnding] = useState(false);

  function openEndDialog() {
    setSheetOpen(false);
    setEnding(true);
  }

  return (
    <>
      <Sheet.Root open={sheetOpen} onOpenChange={setSheetOpen}>
        <Sheet.Trigger
          render={
            <Button
              variant="ghost"
              className="flex min-h-16 w-full justify-start gap-150 rounded-none px-175 py-150 text-left font-normal"
            />
          }
        >
          {children}
        </Sheet.Trigger>
        <Sheet.Overlay />
        <Sheet.Popup>
          <Sheet.Handle />
          <Sheet.Title className="text-heading3">출석 확인</Sheet.Title>
          <Sheet.Body>
            <Sheet.Item
              render={<ServerLink path={`/games/${gameId}/attendance`} />}
              className="min-h-14 justify-start px-100"
            >
              <AttendanceSheetItemContent
                title="출석 입력하기"
                description="불참한 참여자를 골라 출석을 확정합니다."
              />
            </Sheet.Item>
            <Sheet.Item onClick={openEndDialog} className="min-h-14 justify-start px-100">
              <AttendanceSheetItemContent
                title="세션 마치기"
                description="예정보다 일찍 끝났다면 여기서 마쳐 주세요."
              />
            </Sheet.Item>
          </Sheet.Body>
        </Sheet.Popup>
      </Sheet.Root>
      <EndSessionDialog
        open={ending}
        onOpenChange={setEnding}
        gameId={gameId}
        plannedEndAt={plannedEndAt}
      />
    </>
  );
}
