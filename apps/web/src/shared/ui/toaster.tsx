"use client";

import { CircleAlert, CircleCheck } from "lucide-react";
import { Toaster as SonnerToaster } from "sonner";

// 토스트는 "화면을 떠난 뒤 도착한 결과" 자리. 성공·실패를 색만이 아니라 아이콘으로도 구분한다.
export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-center"
      offset={{ bottom: 76 }}
      mobileOffset={{ bottom: 76 }}
      icons={{
        success: <CircleCheck size={16} className="text-success-700" aria-hidden />,
        error: <CircleAlert size={16} aria-hidden />,
      }}
      toastOptions={{
        duration: 2500,
        unstyled: true,
        classNames: {
          // toast is position:absolute; unstyled drops its full width so w-fit
          // alone left-aligns it. inset-x-0 + mx-auto centers it without
          // touching transform (keeps sonner's enter/exit animation).
          toast:
            "inset-x-0 mx-auto flex w-fit items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-lg",
          default: "bg-toast",
          success: "bg-toast",
          error: "bg-danger-solid",
          actionButton: "ml-2 shrink-0 font-bold underline underline-offset-2",
        },
      }}
    />
  );
}
