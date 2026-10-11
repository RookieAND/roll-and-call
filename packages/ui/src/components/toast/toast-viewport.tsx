"use client";

import { CircleAlert, CircleCheck } from "lucide-react";
import { Toaster } from "sonner";

export interface ToastViewportProps {
  position?: "top" | "bottom";
  max?: number;
  offset?: number;
}

export function ToastViewport({ position = "bottom", max = 3, offset = 16 }: ToastViewportProps) {
  // 하단 CTA(FloatingBar)나 하단 탭이 떠 있으면 둘 중 더 높은 쪽 위로 띄운다. 둘은 같은 자리를 쓰므로 합하지 않는다.
  const edge =
    position === "bottom"
      ? {
          bottom: `calc(max(var(--rc-floating-bar-height, 0px), var(--rc-bottom-nav-height, 0px)) + ${offset}px)`,
        }
      : { top: `calc(env(safe-area-inset-top, 0px) + ${offset}px)` };
  // sonner는 모바일에서 토스터를 left:16px, width:100%로 놓아 토스트가 16px 오른쪽으로 쏠린다. 좌우 여백을 0으로 두고 토스트 폭을 따로 줄여 가운데에 맞춘다.
  const mobileEdge = { ...edge, left: 0, right: 0 };
  return (
    <Toaster
      position={`${position}-center`}
      visibleToasts={max}
      offset={edge}
      mobileOffset={mobileEdge}
      icons={{
        success: <CircleCheck size={16} className="text-success-600" aria-hidden />,
        error: <CircleAlert size={16} aria-hidden />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          // inset-x-0 + mx-auto centers the absolute toast without touching transform (keeps sonner's animation)
          // sonner가 자기 font-family를 박아 넣어 브랜드 폰트가 빠진다. font-sans로 되돌린다.
          toast:
            "inset-x-0 mx-auto flex w-fit! max-w-[calc(100%-2rem)] items-center justify-center gap-100 rounded-300 px-200 py-125 font-sans text-sm font-semibold shadow-lg",
          default: "bg-toast text-toast-ink",
          success: "bg-toast text-toast-ink",
          info: "bg-toast text-toast-ink",
          error: "bg-danger-solid text-inverse",
        },
      }}
    />
  );
}
