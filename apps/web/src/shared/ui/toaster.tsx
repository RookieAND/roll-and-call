"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-center"
      offset={{ bottom: 76 }}
      mobileOffset={{ bottom: 76 }}
      toastOptions={{
        duration: 2500,
        unstyled: true,
        classNames: {
          // unstyled strips sonner's centering transform → self-center + w-fit
          // re-centers the pill within the (centered) toaster container.
          toast:
            "mx-auto flex w-fit items-center justify-center gap-2 self-center rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-lg",
          default: "bg-toast",
          success: "bg-toast",
          error: "bg-red-600",
        },
      }}
    />
  );
}
