import { useRender } from "@base-ui-components/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/cn";
import { resolveStateProp } from "../../lib/resolve-state-prop";
import type { StateComponentProps } from "../../lib/state-props";

const card = cva("border border-gray-200", {
  variants: {
    radius: { 400: "rounded-400", 500: "rounded-500", 600: "rounded-600" },
    background: { surface: "bg-surface", subtle: "bg-gray-50", none: "" },
    padding: { none: "", sm: "p-150", md: "p-200", lg: "p-300" },
    interactive: { true: "transition-colors hover:bg-gray-50", false: "" },
  },
  defaultVariants: { radius: 600, background: "surface", padding: "md", interactive: false },
});

type CardState = VariantProps<typeof card>;

export interface CardRootProps extends StateComponentProps<"div", CardState>, CardState {}

export function CardRoot({
  radius = 600,
  background = "surface",
  padding = "md",
  interactive = false,
  className,
  style,
  render,
  ref,
  ...props
}: CardRootProps) {
  const state = { radius, background, padding, interactive };
  return useRender({
    ref,
    defaultTagName: "div",
    render,
    state,
    props: {
      "data-slot": "card",
      className: cn(
        card({ radius, background, padding, interactive }),
        resolveStateProp(className, state),
      ),
      style: resolveStateProp(style, state),
      ...props,
    },
  });
}
