import type { ComponentPropsWithRef } from "react";

import { cn } from "./cn";

const maxWidthMap = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-full",
} as const;

export interface ContainerProps extends ComponentPropsWithRef<"div"> {
  size?: keyof typeof maxWidthMap;
}

export function Container({ className, size = "lg", ...props }: ContainerProps) {
  return <div className={cn("mx-auto w-full px-200", maxWidthMap[size], className)} {...props} />;
}
