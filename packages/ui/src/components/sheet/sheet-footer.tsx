"use client";

import { useRender } from "@base-ui-components/react/use-render";
import { useContext } from "react";

import { cn } from "../../lib/cn";
import { resolveStateProp } from "../../lib/resolve-state-prop";
import type { StateComponentProps } from "../../lib/state-props";
import { SheetContext, type SheetSide } from "./sheet-context";

export type SheetFooterProps = StateComponentProps<"div", { side: SheetSide }>;

export function SheetFooter({ className, style, render, ref, ...props }: SheetFooterProps) {
  const { side } = useContext(SheetContext);
  const state = { side };
  return useRender({
    ref,
    defaultTagName: "div",
    render,
    state,
    props: {
      "data-slot": "sheet-footer",
      className: cn("flex flex-col gap-100 pt-150", resolveStateProp(className, state)),
      style: resolveStateProp(style, state),
      ...props,
    },
  });
}
