"use client";

import { useRender } from "@base-ui-components/react/use-render";
import type { VariantProps } from "class-variance-authority";

import { cn } from "../../lib/cn";
import { resolveStateProp } from "../../lib/resolve-state-prop";
import type { StateComponentProps } from "../../lib/state-props";
import { useFieldControlAria } from "../field/use-field-control-aria";
import { textFieldVariants } from "./text-field-variants";

type TextInputState = { invalid: boolean; disabled: boolean };

export interface TextInputProps
  extends StateComponentProps<"input", TextInputState>, VariantProps<typeof textFieldVariants> {}

export function TextInput({
  invalid = false,
  disabled = false,
  className,
  style,
  render,
  ref,
  "aria-describedby": describedBy,
  ...props
}: TextInputProps) {
  const state = { invalid: Boolean(invalid), disabled };
  const fieldAria = useFieldControlAria({ invalid, describedBy });
  return useRender({
    ref,
    defaultTagName: "input",
    render,
    state,
    props: {
      "data-slot": "text-input",
      ...fieldAria,
      disabled,
      className: cn(
        textFieldVariants({ invalid }),
        "h-11",
        resolveStateProp({ prop: className, state }),
      ),
      style: resolveStateProp({ prop: style, state }),
      ...props,
    },
  });
}
