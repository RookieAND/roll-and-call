"use client";

import { useContext, useRef, type PointerEvent } from "react";

import { cn } from "./cn";
import { SheetContext } from "./sheet-context";

const DISMISS_DISTANCE_PX = 120;

interface SheetHandleProps {
  className?: string;
}

// 드래그 그립. 보조 수단이라 스크린리더에서 숨기고, 닫기는 Close 버튼·ESC로도 늘 된다.
export function SheetHandle({ className }: SheetHandleProps) {
  const { side, dismissible, actionsRef } = useContext(SheetContext);
  const drag = useRef<{ startY: number; popup: HTMLElement } | null>(null);
  const draggable = dismissible && side === "bottom";

  const release = (event: PointerEvent<HTMLDivElement>, cancelled: boolean) => {
    if (!drag.current) return;
    const { startY, popup } = drag.current;
    drag.current = null;
    const distance = event.clientY - startY;
    if (!cancelled && distance > Math.min(DISMISS_DISTANCE_PX, popup.offsetHeight / 4)) {
      actionsRef.current?.close();
      return;
    }
    popup.style.transform = "";
  };

  return (
    <div
      aria-hidden
      data-slot="sheet-handle"
      className={cn("-mt-100 pt-100 pb-200", draggable && "cursor-grab touch-none", className)}
      onPointerDown={(event) => {
        if (!draggable) return;
        const popup = event.currentTarget.closest<HTMLElement>('[data-slot="sheet-popup"]');
        if (!popup) return;
        event.currentTarget.setPointerCapture(event.pointerId);
        drag.current = { startY: event.clientY, popup };
      }}
      onPointerMove={(event) => {
        if (!drag.current) return;
        const distance = Math.max(0, event.clientY - drag.current.startY);
        drag.current.popup.style.transform = `translateY(${distance}px)`;
      }}
      onPointerUp={(event) => release(event, false)}
      onPointerCancel={(event) => release(event, true)}
    >
      <div className="mx-auto h-1 w-[38px] rounded-full bg-gray-300" />
    </div>
  );
}
