"use client";

import { useContext, useEffect, type ReactNode } from "react";

import { CalloutContext } from "./callout-context";
import { calloutInk } from "./callout-ink";
import { cn } from "./cn";
import { Text } from "./text";

export interface CalloutTitleProps {
  className?: string;
  children: ReactNode;
}

export function CalloutTitle({ className, children }: CalloutTitleProps) {
  const { colorPalette, size, setHasTitle } = useContext(CalloutContext);
  useEffect(() => {
    setHasTitle(true);
    return () => setHasTitle(false);
  }, [setHasTitle]);
  return (
    <Text
      data-slot="callout-title"
      typography={size === "sm" ? "body4" : "subtitle2"}
      weight="bold"
      render={<p />}
      className={cn("col-start-2 min-w-0", calloutInk({ colorPalette }), className)}
    >
      {children}
    </Text>
  );
}
