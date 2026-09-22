"use client";

import { useRender } from "@base-ui-components/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import { useState } from "react";

import { CalloutContext, type CalloutPalette } from "./callout-context";
import { cn } from "./cn";
import { resolveStateProp } from "./resolve-state-prop";
import type { StateComponentProps } from "./state-props";

// 화면 흐름 안에 끼는 안내 상자.
const callout = cva("grid grid-cols-[auto_1fr_auto] items-start border", {
  variants: {
    variant: { tinted: "", outline: "bg-transparent" },
    colorPalette: { gray: "", primary: "", success: "", warning: "", notice: "", danger: "" },
    // sm은 필드 바로 아래에 붙는 상자, md는 단계·시트 안에 따로 서는 상자.
    size: { sm: "rounded-400 px-150 py-150", md: "rounded-500 px-175 py-150" },
  },
  compoundVariants: [
    { variant: "tinted", colorPalette: "gray", className: "border-gray-200 bg-gray-50" },
    { variant: "tinted", colorPalette: "primary", className: "border-transparent bg-tinted-bg" },
    { variant: "tinted", colorPalette: "success", className: "border-success-200 bg-success-50" },
    { variant: "tinted", colorPalette: "warning", className: "border-transparent bg-warning-50" },
    { variant: "tinted", colorPalette: "notice", className: "border-transparent bg-notice-bg" },
    { variant: "tinted", colorPalette: "danger", className: "border-danger-200 bg-danger-50" },
    { variant: "outline", colorPalette: "gray", className: "border-gray-200" },
    { variant: "outline", colorPalette: "primary", className: "border-tinted-border" },
    { variant: "outline", colorPalette: "success", className: "border-success-200" },
    { variant: "outline", colorPalette: "warning", className: "border-notice-border" },
    { variant: "outline", colorPalette: "notice", className: "border-notice-border" },
    { variant: "outline", colorPalette: "danger", className: "border-danger-200" },
  ],
  defaultVariants: { variant: "tinted", colorPalette: "gray", size: "md" },
});

type CalloutState = Required<VariantProps<typeof callout>>;

export interface CalloutRootProps
  extends StateComponentProps<"div", CalloutState>, VariantProps<typeof callout> {}

// 색만으로 뜻을 전하지 않도록 Icon이 팔레트별 기본 아이콘을 갖는다.
export function CalloutRoot({
  variant = "tinted",
  colorPalette = "gray",
  size = "md",
  className,
  style,
  render,
  ref,
  children,
  ...props
}: CalloutRootProps) {
  const [hasTitle, setHasTitle] = useState(false);
  const state = { variant, colorPalette, size };
  const urgent = colorPalette === "danger" || colorPalette === "warning";
  const element = useRender({
    ref,
    defaultTagName: "div",
    render,
    state,
    stateAttributesMapping: {
      colorPalette: (palette) => ({ "data-color-palette": String(palette) }),
    },
    props: {
      "data-slot": "callout",
      role: urgent ? "alert" : "note",
      className: cn(callout({ variant, colorPalette, size }), resolveStateProp(className, state)),
      style: resolveStateProp(style, state),
      ...props,
      children,
    },
  });
  return (
    <CalloutContext.Provider
      value={{
        colorPalette: colorPalette as CalloutPalette,
        size: size as "sm" | "md",
        hasTitle,
        setHasTitle,
      }}
    >
      {element}
    </CalloutContext.Provider>
  );
}
