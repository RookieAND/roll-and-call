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
          // toast is position:absolute; unstyled drops its full width so w-fit
          // alone left-aligns it. inset-x-0 + mx-auto centers it without
          // touching transform (keeps sonner's enter/exit animation).
          toast:
            "inset-x-0 mx-auto flex w-fit items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white shadow-lg",
          default: "bg-toast",
          success: "bg-toast",
          error: "bg-danger-solid",
        },
      }}
    />
  );
}
