"use client";

import { useRender } from "@base-ui-components/react/use-render";
import type { VariantProps } from "class-variance-authority";

import { cn } from "../../lib/cn";
import { resolveStateProp } from "../../lib/resolve-state-prop";
import type { StateComponentProps } from "../../lib/state-props";
import { useFieldControlAria } from "../field/use-field-control-aria";
import { textFieldVariants } from "./text-field-variants";

type TextareaState = { invalid: boolean; disabled: boolean };

export interface TextareaProps
  extends StateComponentProps<"textarea", TextareaState>, VariantProps<typeof textFieldVariants> {}

export function Textarea({
  invalid = false,
  disabled = false,
  className,
  style,
  render,
  ref,
  "aria-describedby": describedBy,
  ...props
}: TextareaProps) {
  const state = { invalid: Boolean(invalid), disabled };
  const fieldAria = useFieldControlAria(invalid, describedBy);
  return useRender({
    ref,
    defaultTagName: "textarea",
    render,
    state,
    props: {
      "data-slot": "textarea",
      ...fieldAria,
      disabled,
      className: cn(
        textFieldVariants({ invalid }),
        "min-h-24 py-125",
        resolveStateProp(className, state),
      ),
      style: resolveStateProp(style, state),
      ...props,
    },
  });
}
