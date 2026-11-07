"use client";

import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";
import type { CSSProperties } from "react";
import { Toaster } from "sonner";

import { useDesktop } from "../../lib/use-desktop";

export interface ToastViewportProps {
  position?: "top" | "bottom";
  // 1100px 이상에서 한 번에 보이는 개수. 1100px 미만은 늘 1개다.
  max?: number;
  offset?: number;
  // 1100px 이상에서 우상단에 쌓는다(웹 데스크톱 뷰). 어드민은 켜지 않는다.
  desktopTopRight?: boolean;
}

export function ToastViewport({
  position = "bottom",
  max = 3,
  offset = 16,
  desktopTopRight = false,
}: ToastViewportProps) {
  const desktop = useDesktop() && desktopTopRight;
  // 하단 CTA(FloatingBar)나 하단 탭이 떠 있으면 둘 중 더 높은 쪽 위로 띄운다. 둘은 같은 자리를 쓰므로 합하지 않는다.
  const edge =
    position === "bottom"
      ? {
          bottom: `calc(max(var(--rc-floating-bar-height, 0px), var(--rc-bottom-nav-height, 0px)) + ${offset}px)`,
        }
      : { top: `calc(env(safe-area-inset-top, 0px) + ${offset}px)` };
  // 1100px 이상에서는 화면 우상단(top/right 16px)에 360px 폭으로 쌓는다.
  const desktopEdge = { top: `calc(env(safe-area-inset-top, 0px) + ${offset}px)`, right: offset };
  // sonner는 600px 미만만 모바일로 보고 그 위로는 356px 가운데 정렬이다. 1100px 미만 전부를 좌우 여백만 남긴 전폭으로 덮는다.
  const style = (
    desktop
      ? { "--width": "360px" }
      : { left: offset, right: offset, width: "auto", transform: "none" }
  ) as CSSProperties;
  return (
    <Toaster
      position={desktop ? "top-right" : `${position}-center`}
      visibleToasts={desktop ? max : 1}
      gap={8}
      style={style}
      offset={desktop ? desktopEdge : edge}
      mobileOffset={edge}
      icons={{
        success: <CircleCheck size={18} className="text-toast-success" aria-hidden />,
        warning: <TriangleAlert size={18} className="text-toast-warning" aria-hidden />,
        error: <CircleAlert size={18} className="text-toast-danger" aria-hidden />,
        info: <Info size={18} className="text-toast-muted" aria-hidden />,
      }}
      toastOptions={{
        unstyled: true,
        classNames: {
          // sonner가 자기 font-family를 박아 넣어 브랜드 폰트가 빠진다. font-sans로 되돌린다.
          // 네 종류 모두 같은 어두운 바탕이고 아이콘 색으로만 가른다. 다크는 바탕이 캔버스와 가까워 경계선을 둔다.
          toast:
            "inset-x-0 flex min-h-12 w-full! items-center gap-100 rounded-300 bg-toast px-200 py-125 font-sans text-body2 font-semibold text-toast-ink shadow-lg dark:border dark:border-gray-300 desktop:shadow-[0_10px_15px_-3px_rgb(0_0_0/0.15)]",
          icon: "flex h-6 shrink-0 items-center self-start",
          content: "flex min-w-0 flex-1 flex-col",
          description: "text-body4 font-normal text-toast-muted",
          actionButton:
            "-my-125 flex min-h-11 shrink-0 items-center px-100 font-bold text-toast-ink",
          closeButton:
            "order-last -my-125 -mr-100 flex size-11 shrink-0 items-center justify-center text-toast-muted hover:text-toast-ink",
        },
      }}
    />
  );
}
