import { useRender } from "@base-ui-components/react/use-render";

import { cn } from "./cn";
import { resolveStateProp } from "./resolve-state-prop";
import type { StateComponentProps } from "./state-props";

const maxWidthMap = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-full",
} as const;

type ContainerState = { size: keyof typeof maxWidthMap };

export interface ContainerProps extends StateComponentProps<"div", ContainerState> {
  size?: keyof typeof maxWidthMap;
}

export function Container({
  className,
  style,
  size = "lg",
  render,
  ref,
  ...props
}: ContainerProps) {
  const state = { size };
  return useRender({
    ref,
    defaultTagName: "div",
    render,
    state,
    props: {
      "data-slot": "container",
      className: cn("mx-auto w-full px-200", maxWidthMap[size], resolveStateProp(className, state)),
      style: resolveStateProp(style, state),
      ...props,
    },
  });
}
