"use client";

import { Dialog } from "@base-ui-components/react/dialog";
import { cva } from "class-variance-authority";
import { useContext, type ComponentPropsWithRef } from "react";

import { cn } from "./cn";
import { OverlayPresence } from "./overlay-presence";
import { resolveStateProp } from "./resolve-state-prop";
import { SheetContext } from "./sheet-context";
import { SheetOverlay } from "./sheet-overlay";

// 키보드가 올라와도 Footer가 보이도록 높이를 88dvh에서 끊고, 넘치는 내용은 Body가 스크롤한다.
// scrollbar-width는 상속되니 시트 안의 스크롤 영역은 막대 없이 넘긴다. 끝이 잘린 줄이 스크롤을 대신 알린다.
const popup = cva(
  "fixed z-(--rc-z-sheet) flex flex-col overflow-y-auto border-gray-200 bg-surface p-250 outline-none [scrollbar-width:none]",
  {
    variants: {
      side: {
        bottom:
          "inset-x-0 bottom-0 mx-auto max-h-[88dvh] max-w-[412px] rounded-t-800 border-t pb-[calc(var(--spacing-250)+var(--rc-safe-bottom))] shadow-[0_-8px_28px_rgba(23,23,28,0.1)]",
        left: "inset-y-0 left-0 h-dvh w-[min(360px,88vw)] border-r shadow-[8px_0_28px_rgba(23,23,28,0.1)]",
        right:
          "inset-y-0 right-0 h-dvh w-[min(360px,88vw)] border-l shadow-[-8px_0_28px_rgba(23,23,28,0.1)]",
      },
      size: { auto: "", half: "", full: "" },
    },
    compoundVariants: [
      { side: "bottom", size: "half", className: "h-[50dvh]" },
      { side: "bottom", size: "full", className: "h-dvh max-h-dvh rounded-none" },
    ],
  },
);

export type SheetPopupProps = ComponentPropsWithRef<typeof Dialog.Popup>;

// Portal · Overlay를 알아서 감싸는 기본형. 시트 안에 시트나 다이얼로그를 겹쳐 열지 않는다.
export function SheetPopup({ className, children, ...props }: SheetPopupProps) {
  const { side, size } = useContext(SheetContext);
  return (
    <Dialog.Portal>
      <SheetOverlay />
      <Dialog.Popup
        data-slot="sheet-popup"
        data-side={side}
        data-size={size}
        className={(state) => cn(popup({ side, size }), resolveStateProp(className, state))}
        {...props}
      >
        <OverlayPresence />
        {children}
      </Dialog.Popup>
    </Dialog.Portal>
  );
}
