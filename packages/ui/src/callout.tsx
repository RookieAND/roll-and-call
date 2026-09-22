import { useRender } from "@base-ui-components/react/use-render";
import { cva, type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";

import { cn } from "./cn";
import { resolveStateProp } from "./resolve-state-prop";
import type { StateComponentProps } from "./state-props";
import { Text } from "./text";

// 화면 흐름 안에 끼는 안내 상자. 제목이 있으면 본문은 회색, 없으면 본문이 톤 색을 받는다.
const callout = cva("flex flex-row gap-100 border", {
  variants: {
    tone: {
      neutral: "border-gray-200 bg-gray-50",
      danger: "border-danger-200 bg-danger-50",
      tinted: "border-transparent bg-tinted-bg",
      notice: "border-transparent bg-notice-bg",
    },
    // sm은 필드 바로 아래에 붙는 상자, md는 단계·시트 안에 따로 서는 상자.
    size: {
      sm: "rounded-400 px-150 py-150",
      md: "rounded-500 px-175 py-150",
    },
  },
  defaultVariants: { tone: "neutral", size: "md" },
});

const ink = cva("", {
  variants: {
    tone: {
      neutral: "text-gray-900",
      danger: "text-danger-600",
      tinted: "text-tinted-ink",
      notice: "text-notice-ink",
    },
  },
  defaultVariants: { tone: "neutral" },
});

type CalloutState = VariantProps<typeof callout>;

export interface CalloutProps
  extends Omit<StateComponentProps<"div", CalloutState>, "title">, CalloutState {
  icon?: ReactNode;
  title?: ReactNode;
  action?: ReactNode;
}

export function Callout({
  tone = "neutral",
  size = "md",
  icon,
  title,
  action,
  className,
  style,
  render,
  ref,
  children,
  ...props
}: CalloutProps) {
  const neutral = !tone || tone === "neutral";
  const toneInk = ink({ tone });
  const iconInk = neutral ? "text-gray-500" : toneInk;
  const bodyInk = title || neutral ? "text-gray-600" : toneInk;
  const state = { tone, size };
  return useRender({
    ref,
    defaultTagName: "div",
    render,
    state,
    props: {
      "data-slot": "callout",
      className: cn(
        callout({ tone, size }),
        action ? "items-center" : "items-start",
        resolveStateProp(className, state),
      ),
      style: resolveStateProp(style, state),
      ...props,
      children: (
        <>
          {icon && (
            <span
              aria-hidden
              data-slot="callout-icon"
              className={cn("mt-025 flex-none self-start", iconInk)}
            >
              {icon}
            </span>
          )}
          <div className="min-w-0 flex-1">
            {title && (
              <Text
                data-slot="callout-title"
                typography={size === "sm" ? "body4" : "subtitle2"}
                weight="bold"
                render={<p />}
                className={toneInk}
              >
                {title}
              </Text>
            )}
            {children && (
              <Text
                data-slot="callout-description"
                typography="body4"
                render={<p />}
                className={cn("text-pretty leading-[1.55]", title && "mt-025", bodyInk)}
              >
                {children}
              </Text>
            )}
          </div>
          {action && (
            <div data-slot="callout-action" className="flex-none">
              {action}
            </div>
          )}
        </>
      ),
    },
  });
}
