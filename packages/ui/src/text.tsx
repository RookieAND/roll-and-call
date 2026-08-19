import { useRender } from "@base-ui-components/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentPropsWithRef, ReactElement } from "react";
import { cn } from "./cn";

const text = cva("", {
  variants: {
    typography: {
      display1: "text-[28px] leading-[1.2] font-extrabold tracking-tight",
      heading1: "text-[22px] leading-[1.25] font-extrabold tracking-tight",
      heading2: "text-[18px] leading-[1.3] font-bold",
      heading3: "text-[16px] leading-[1.4] font-bold",
      subtitle1: "text-[14px] leading-[1.4] font-bold",
      subtitle2: "text-[12px] leading-[1.4] font-bold",
      body1: "text-[16px] leading-[1.6] font-normal",
      body2: "text-[14px] leading-[1.5] font-normal",
      body3: "text-[13px] leading-[1.5] font-normal",
      body4: "text-[12px] leading-[1.4] font-normal",
      code1: "font-mono text-[13px] leading-[1.5] font-normal",
      code2: "font-mono text-[12px] leading-[1.4] font-normal",
    },
    foreground: {
      normal: "text-gray-900",
      muted: "text-gray-500",
      hint: "text-gray-400",
      primary: "text-primary-600",
      success: "text-success-700",
      danger: "text-red-600",
      white: "text-white",
    },
  },
  defaultVariants: { typography: "body2", foreground: "normal" },
});

export type TextProps = ComponentPropsWithRef<"span"> &
  VariantProps<typeof text> & {
    /** Render as a different element (e.g. <Text render={<h1 />} />). */
    render?: ReactElement<Record<string, unknown>>;
  };

export function Text({ typography, foreground, className, render, ...props }: TextProps) {
  return useRender({
    defaultTagName: "span",
    render,
    props: { className: cn(text({ typography, foreground }), className), ...props },
  });
}
