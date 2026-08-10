import type { ComponentPropsWithRef } from "react";
import { cn } from "./cn";

export type BoxProps = ComponentPropsWithRef<"div">;

export function Box({ className, ...props }: BoxProps) {
  return <div className={cn(className)} {...props} />;
}
