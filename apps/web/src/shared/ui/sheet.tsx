"use client";

import { Dialog } from "@base-ui-components/react/dialog";
import { Button, type ButtonProps, cn } from "@trpg/ui";
import type { ReactNode } from "react";

function Content({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Dialog.Portal>
      <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/30" />
      <Dialog.Popup
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 mx-auto max-w-[412px] rounded-t-[20px] border-t border-gray-200 bg-surface p-5 shadow-[0_-8px_28px_rgba(23,23,28,0.1)] outline-none",
          className,
        )}
      >
        <div className="mx-auto mb-4 h-1 w-[38px] rounded-full bg-gray-300" />
        {children}
      </Dialog.Popup>
    </Dialog.Portal>
  );
}

function Title({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <Dialog.Title className={cn("mb-3 text-sm font-bold text-gray-500", className)}>
      {children}
    </Dialog.Title>
  );
}

// 시트 메뉴 행: 좌우 꽉 찬 텍스트 행, 마지막 행만 구분선 없음. asChild로 Link 렌더.
function Item({ className, ...props }: ButtonProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        "h-auto min-h-[52px] w-full justify-between rounded-none border-b border-gray-100 px-0 text-left text-[14.5px] font-normal text-gray-800 last:border-b-0 hover:bg-transparent",
        className,
      )}
      {...props}
    />
  );
}

// Compound API (Select와 동일한 dot-notation): Sheet.Root / Trigger / Content / Title.
// Base UI Dialog에 스타일만 입혀 내보낸다. 열림 상태는 Root에 open/onOpenChange로 제어하거나
// Sheet.Trigger(asChild)로 조합한다.
export const Sheet = {
  Root: Dialog.Root,
  Trigger: Dialog.Trigger,
  Close: Dialog.Close,
  Content,
  Title,
  Item,
};
