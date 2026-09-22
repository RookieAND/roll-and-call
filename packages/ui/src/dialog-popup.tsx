"use client";

import { Dialog } from "@base-ui-components/react/dialog";
import type { VariantProps } from "class-variance-authority";
import { useEffect, useRef, type ComponentPropsWithRef } from "react";

import { cn } from "./cn";
import { dialogPopupVariants } from "./dialog-popup-variants";
import { OverlayPresence } from "./overlay-presence";
import { resolveStateProp } from "./resolve-state-prop";

export interface DialogPopupProps
  extends ComponentPropsWithRef<typeof Dialog.Popup>, VariantProps<typeof dialogPopupVariants> {}

// Portal · Overlay를 알아서 감싸는 기본형. 선택지가 3개 이하이고 바로 답하는 물음만 다이얼로그로 띄운다.
export function DialogPopup({ size = "md", className, children, ref, ...props }: DialogPopupProps) {
  const element = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    if (!element.current?.querySelector('[data-slot="dialog-title"]')) {
      console.warn("Dialog.Popup에는 Dialog.Title이 있어야 화면 낭독기가 무엇을 묻는지 읽는다.");
    }
  }, []);

  return (
    <Dialog.Portal>
      <Dialog.Backdrop
        data-slot="dialog-overlay"
        className="fixed inset-0 z-(--rc-z-overlay) bg-dim"
      />
      <Dialog.Popup
        ref={(node) => {
          element.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        data-slot="dialog-popup"
        data-size={size ?? undefined}
        className={(state) => cn(dialogPopupVariants({ size }), resolveStateProp(className, state))}
        {...props}
      >
        <OverlayPresence />
        {children}
      </Dialog.Popup>
    </Dialog.Portal>
  );
}
