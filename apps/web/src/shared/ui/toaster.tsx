"use client";

import { CircleAlert, CircleCheck } from "lucide-react";
import { Toaster as SonnerToaster } from "sonner";

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
          // inset-x-0 + mx-auto centers the absolute toast without touching transform (keeps sonner's animation)
          toast:
            "inset-x-0 mx-auto flex w-fit items-center justify-center gap-100 rounded-300 px-200 py-125 text-sm font-semibold text-white shadow-lg",
          default: "bg-toast",
          success: "bg-toast",
          error: "bg-danger-solid",
          actionButton: "ml-100 shrink-0 font-bold underline underline-offset-2",
        },
      }}
    />
  );
}
