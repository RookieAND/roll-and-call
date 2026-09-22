import { useRender } from "@base-ui-components/react/use-render";
import { cva } from "class-variance-authority";

import { cn } from "./cn";
import { resolveStateProp } from "./resolve-state-prop";
import type { StateComponentProps } from "./state-props";

const track = cva(
  "relative inline-flex h-[26px] w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:pointer-events-none disabled:opacity-50",
  {
    variants: { checked: { true: "bg-primary-600", false: "bg-gray-300" } },
  },
);

const knob = cva(
  "inline-block size-[22px] rounded-full bg-surface shadow-sm transition-transform",
  {
    variants: { checked: { true: "translate-x-5", false: "translate-x-0.5" } },
  },
);

type SwitchState = { checked: boolean; disabled: boolean };

export interface SwitchProps extends Omit<
  StateComponentProps<"button", SwitchState>,
  "onChange" | "value"
> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function Switch({
  checked,
  onCheckedChange,
  disabled = false,
  className,
  style,
  render,
  ref,
  ...props
}: SwitchProps) {
  const state = { checked, disabled };
  return useRender({
    ref,
    defaultTagName: "button",
    render,
    state,
    props: {
      "data-slot": "switch",
      "data-state": checked ? "checked" : "unchecked",
      type: "button",
      role: "switch",
      "aria-checked": checked,
      disabled,
      onClick: () => onCheckedChange(!checked),
      className: cn(track({ checked }), resolveStateProp(className, state)),
      style: resolveStateProp(style, state),
      ...props,
      children: <span aria-hidden data-slot="switch-thumb" className={knob({ checked })} />,
    },
  });
}
