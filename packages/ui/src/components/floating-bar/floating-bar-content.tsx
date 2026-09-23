"use client";

import { useRender } from "@base-ui-components/react/use-render";
import { cva } from "class-variance-authority";
import { useContext, useEffect, useRef } from "react";

import { cn } from "../../lib/cn";
import { resolveStateProp } from "../../lib/resolve-state-prop";
import type { StateComponentProps } from "../../lib/state-props";
import { FloatingBarContext } from "./floating-bar-context";
import { useScrolledToBottom } from "./use-scrolled-to-bottom";

const bar = cva(
  "fixed inset-x-0 bottom-0 z-(--rc-z-floating-bar) border-t border-gray-200 bg-surface px-250 pt-150 transition-[translate,box-shadow] duration-(--rc-duration-base) ease-(--rc-ease-out)",
  {
    variants: {
      safeArea: { true: "pb-[calc(var(--spacing-150)+var(--rc-safe-bottom))]", false: "pb-150" },
      shadow: { true: "shadow-[0_-8px_28px_rgba(23,23,28,0.1)]", false: "" },
      hidden: { true: "invisible translate-y-full", false: "" },
    },
  },
);

type FloatingBarState = { elevated: boolean; hidden: boolean };

export type FloatingBarContentProps = StateComponentProps<"div", FloatingBarState>;

// 화면 하단 주 CTA 자리. 본문 끝에 FloatingBar.Spacer를 꼭 같이 둔다.
export function FloatingBarContent({
  className,
  style,
  render,
  ref,
  ...props
}: FloatingBarContentProps) {
  const { setHeight, elevated, safeArea, hidden } = useContext(FloatingBarContext);
  const atBottom = useScrolledToBottom(elevated);
  const element = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = element.current;
    if (!node) return;
    const root = document.documentElement;
    const observer = new ResizeObserver(() => {
      setHeight(node.offsetHeight);
      root.style.setProperty("--rc-floating-bar-height", `${node.offsetHeight}px`);
    });
    observer.observe(node);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--rc-floating-bar-height");
    };
  }, [setHeight]);

  const state = { elevated: elevated && !atBottom, hidden };
  return useRender({
    ref: ref ? [element, ref] : element,
    defaultTagName: "div",
    render,
    state,
    props: {
      "data-slot": "floating-bar",
      "aria-hidden": hidden || undefined,
      inert: hidden || undefined,
      className: cn(
        bar({ safeArea, shadow: state.elevated, hidden }),
        resolveStateProp(className, state),
      ),
      style: resolveStateProp(style, state),
      ...props,
    },
  });
}
