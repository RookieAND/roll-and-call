import { useRender } from "@base-ui-components/react/use-render";
import type { VariantProps } from "class-variance-authority";

import { cn } from "../../lib/cn";
import { resolveStateProp } from "../../lib/resolve-state-prop";
import type { StateComponentProps } from "../../lib/state-props";
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
  ...props
}: TextInputProps) {
  const state = { invalid: Boolean(invalid), disabled };
  return useRender({
    ref,
    defaultTagName: "input",
    render,
    state,
    props: {
      "data-slot": "text-input",
      disabled,
      className: cn(textFieldVariants({ invalid }), "h-11", resolveStateProp(className, state)),
      style: resolveStateProp(style, state),
      ...props,
    },
  });
}
