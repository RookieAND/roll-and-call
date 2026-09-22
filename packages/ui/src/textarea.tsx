import { useRender } from "@base-ui-components/react/use-render";
import type { VariantProps } from "class-variance-authority";

import { cn } from "./cn";
import { resolveStateProp } from "./resolve-state-prop";
import type { StateComponentProps } from "./state-props";
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
  ...props
}: TextareaProps) {
  const state = { invalid: Boolean(invalid), disabled };
  return useRender({
    ref,
    defaultTagName: "textarea",
    render,
    state,
    props: {
      "data-slot": "textarea",
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
