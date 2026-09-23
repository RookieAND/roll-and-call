"use client";

import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";
import { useContext, type ReactNode } from "react";

import { cn } from "../../lib/cn";
import { CalloutContext, type CalloutPalette } from "./callout-context";
import { calloutInk } from "./callout-ink";

const DEFAULT_ICON: Record<CalloutPalette, ReactNode> = {
  gray: <Info size={14} strokeWidth={2.2} />,
  primary: <Info size={14} strokeWidth={2.2} />,
  success: <CircleCheck size={14} strokeWidth={2.2} />,
  warning: <TriangleAlert size={14} strokeWidth={2.2} />,
  notice: <Info size={14} strokeWidth={2.2} />,
  danger: <CircleAlert size={14} strokeWidth={2.2} />,
};

export interface CalloutIconProps {
  className?: string;
  children?: ReactNode;
}

export function CalloutIcon({ className, children }: CalloutIconProps) {
  const { colorPalette } = useContext(CalloutContext);
  return (
    <span
      aria-hidden
      data-slot="callout-icon"
      className={cn(
        "col-start-1 row-span-2 mt-025 mr-100 flex-none self-start",
        colorPalette === "gray" ? "text-gray-500" : calloutInk({ colorPalette }),
        className,
      )}
    >
      {children ?? DEFAULT_ICON[colorPalette]}
    </span>
  );
}
