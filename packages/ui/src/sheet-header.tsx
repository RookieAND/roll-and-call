"use client";

import { useRender } from "@base-ui-components/react/use-render";
import { useContext } from "react";

import { cn } from "./cn";
import { resolveStateProp } from "./resolve-state-prop";
import { SheetContext, type SheetSide } from "./sheet-context";
import type { StateComponentProps } from "./state-props";

export type SheetHeaderProps = StateComponentProps<"div", { side: SheetSide }>;

export function SheetHeader({ className, style, render, ref, ...props }: SheetHeaderProps) {
  const { side } = useContext(SheetContext);
  const state = { side };
  return useRender({
    ref,
    defaultTagName: "div",
    render,
    state,
    props: {
      "data-slot": "sheet-header",
      className: cn("flex flex-col gap-050 pb-150", resolveStateProp(className, state)),
      style: resolveStateProp(style, state),
      ...props,
    },
  });
}
