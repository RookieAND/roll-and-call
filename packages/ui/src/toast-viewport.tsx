"use client";

import { CircleAlert, CircleCheck } from "lucide-react";
import { Toaster } from "sonner";

export interface ToastViewportProps {
  position?: "top" | "bottom";
  // 한 번에 보이는 개수. 넘치면 오래된 것부터 걷힌다.
  max?: number;
  // 화면 끝(하단이면 FloatingBar 위)에서 띄우는 거리(px).
  offset?: number;
}

// 앱 전체에 하나만 둔다.
export function ToastViewport({ position = "bottom", max = 3, offset = 16 }: ToastViewportProps) {
  const edge =
    position === "bottom"
      ? { bottom: `calc(var(--rc-floating-bar-height, 0px) + ${offset}px)` }
      : { top: offset };
  return (
    <Toaster
      position={`${position}-center`}
      visibleToasts={max}
      offset={edge}
      mobileOffset={edge}
      icons={{
        success: <CircleCheck size={16} className="text-success-600" aria-hidden />,
        error: <CircleAlert size={16} aria-hidden />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          // inset-x-0 + mx-auto centers the absolute toast without touching transform (keeps sonner's animation)
          toast:
            "inset-x-0 mx-auto flex w-fit items-center justify-center gap-100 rounded-300 px-200 py-125 text-sm font-semibold text-inverse shadow-lg",
          default: "bg-toast",
          success: "bg-toast",
          info: "bg-toast",
          error: "bg-danger-solid",
          actionButton: "ml-100 shrink-0 font-bold underline underline-offset-2",
          closeButton: "ml-100 shrink-0 rounded-full p-050 opacity-80 hover:opacity-100",
        },
      }}
    />
  );
}
