"use client";

import { Button, Sheet } from "@roll-and-call/ui";
import type { ReactNode } from "react";

import type { BadgeDetail } from "../model/badge-detail";
import { BadgeDetailContent } from "./badge-detail-content";

interface BadgeDetailSheetProps {
  detail: BadgeDetail;
  children: ReactNode;
  className?: string;
}

// 도감·목록의 뱃지를 누르면 상세를 연다. 누르는 자리의 모양은 children이 정한다.
export function BadgeDetailSheet({ detail, children, className }: BadgeDetailSheetProps) {
  return (
    <Sheet.Root>
      <Sheet.Trigger aria-label={`${detail.name} 자세히 보기`} className={className}>
        {children}
      </Sheet.Trigger>
      <Sheet.Popup aria-label={detail.name}>
        <Sheet.Handle />
        <Sheet.Body className="[scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <BadgeDetailContent detail={detail} />
        </Sheet.Body>
        <Sheet.Footer className="pt-200">
          <Sheet.Close render={<Button variant="outline" size="lg" className="w-full" />}>
            닫기
          </Sheet.Close>
        </Sheet.Footer>
      </Sheet.Popup>
    </Sheet.Root>
  );
}
