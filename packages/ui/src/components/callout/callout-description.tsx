"use client";

import { useContext, type ReactNode } from "react";

import { cn } from "../../lib/cn";
import { Text } from "../text/text";
import { CalloutContext } from "./callout-context";
import { calloutInk } from "./callout-ink";

export interface CalloutDescriptionProps {
  className?: string;
  children: ReactNode;
}

export function CalloutDescription({ className, children }: CalloutDescriptionProps) {
  const { colorPalette, hasTitle } = useContext(CalloutContext);
  const ink = hasTitle || colorPalette === "gray" ? "text-gray-600" : calloutInk({ colorPalette });
  return (
    <Text
      data-slot="callout-description"
      typography="body4"
      render={<p />}
      className={cn(
        "col-start-2 min-w-0 text-pretty leading-[1.55]",
        hasTitle && "mt-025",
        ink,
        className,
      )}
    >
      {children}
    </Text>
  );
}
