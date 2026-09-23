import { useRender } from "@base-ui-components/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/cn";
import { resolveStateProp } from "../../lib/resolve-state-prop";
import type { StateComponentProps } from "../../lib/state-props";
import { gapMap, type GapToken } from "../../tokens/gap";

const flex = cva("", {
  variants: {
    direction: { row: "flex-row", column: "flex-col" },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
      baseline: "items-baseline",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    },
    wrap: { true: "flex-wrap" },
    inline: { true: "inline-flex", false: "flex" },
  },
  defaultVariants: { direction: "row", inline: false },
});

type FlexState = Pick<VariantProps<typeof flex>, "direction">;

export interface FlexProps
  extends StateComponentProps<"div", FlexState>, Omit<VariantProps<typeof flex>, "inline"> {
  inline?: boolean;
  // 간격만 레시피 밖이다. 토큰 이름을 그대로 클래스에 얹는 정적 맵이라 스캐너가 본다.
  gap?: GapToken;
}

export function Flex({
  className,
  style,
  direction = "row",
  align,
  justify,
  gap,
  wrap,
  inline,
  render,
  ref,
  ...props
}: FlexProps) {
  const state = { direction };
  return useRender({
    ref,
    defaultTagName: "div",
    render,
    state,
    props: {
      "data-slot": direction === "column" ? "v-stack" : "h-stack",
      className: cn(
        flex({ direction, align, justify, wrap, inline: inline ?? false }),
        gap !== undefined && gapMap[gap],
        resolveStateProp(className, state),
      ),
      style: resolveStateProp(style, state),
      ...props,
    },
  });
}

export interface StackProps extends Omit<FlexProps, "direction"> {}
