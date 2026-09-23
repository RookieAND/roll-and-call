"use client";

import { useRender } from "@base-ui-components/react/use-render";
import { useContext } from "react";

import { cn } from "../../lib/cn";
import { resolveStateProp } from "../../lib/resolve-state-prop";
import type { StateComponentProps } from "../../lib/state-props";
import { SheetContext, type SheetSide } from "./sheet-context";

export type SheetBodyProps = StateComponentProps<"div", { side: SheetSide }>;

export function SheetBody({ className, style, render, ref, ...props }: SheetBodyProps) {
  const { side } = useContext(SheetContext);
  const state = { side };
  return useRender({
    ref,
    defaultTagName: "div",
    render,
    state,
    props: {
      "data-slot": "sheet-body",
      className: cn("min-h-0 flex-1 overflow-y-auto", resolveStateProp(className, state)),
      style: resolveStateProp(style, state),
      ...props,
    },
  });
}
