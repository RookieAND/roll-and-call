"use client";

import { Dialog } from "@base-ui-components/react/dialog";
import { cva } from "class-variance-authority";
import { useContext, type ComponentPropsWithRef } from "react";

import { cn } from "../../lib/cn";
import { OverlayPresence } from "../../lib/overlay-presence";
import { resolveStateProp } from "../../lib/resolve-state-prop";
import { SheetContext } from "./sheet-context";
import { SheetOverlay } from "./sheet-overlay";

// 1100px 이상(desktop)에서는 같은 시트가 화면 가운데 480px Dialog 모양으로 바뀐다(핸들 없음). 마크업이 같아 사용처는 그대로다.
// 키보드가 올라와도 Footer가 보이도록 높이를 88dvh에서 끊고, 넘치는 내용은 Body가 스크롤한다.
// 시트 자체는 막대 없이 넘긴다. 끝이 잘린 줄이 스크롤을 대신 알린다. 안쪽 목록은 전역 thin 막대를 쓴다.
const popup = cva(
  "fixed z-(--rc-z-sheet) flex flex-col overflow-y-auto border-gray-200 bg-surface p-250 outline-none scrollbar-none [&::-webkit-scrollbar]:hidden",
  {
    variants: {
      side: {
        bottom:
          "inset-x-0 bottom-0 mx-auto max-h-[88dvh] max-w-103 rounded-t-800 border-t pb-[calc(var(--spacing-250)+var(--rc-safe-bottom))] shadow-[0_-8px_28px_rgba(23,23,28,0.1)] desktop:inset-auto desktop:top-1/2 desktop:left-1/2 desktop:max-h-[min(560px,88dvh)] desktop:w-[480px] desktop:max-w-[calc(100vw-2rem)] desktop:-translate-x-1/2 desktop:-translate-y-1/2 desktop:rounded-800 desktop:border desktop:pb-250 desktop:shadow-[0_24px_64px_rgba(0,0,0,0.28)]",
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

// 시트 안에 시트나 다이얼로그를 겹쳐 열지 않는다.
export function SheetPopup({ className, children, ...props }: SheetPopupProps) {
  const { side, size } = useContext(SheetContext);
  return (
    <Dialog.Portal>
      <SheetOverlay />
      <Dialog.Popup
        data-slot="sheet-popup"
        data-side={side}
        data-size={size}
        className={(state) =>
          cn(popup({ side, size }), resolveStateProp({ prop: className, state }))
        }
        {...props}
      >
        <OverlayPresence />
        {children}
      </Dialog.Popup>
    </Dialog.Portal>
  );
}
