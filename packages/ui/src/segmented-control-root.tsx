"use client";

import { cva } from "class-variance-authority";
import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";

import { cn } from "./cn";
import { SegmentedControlContext } from "./segmented-control-context";

const root = cva("relative inline-flex gap-050 rounded-400 bg-gray-100 p-050", {
  variants: { fullWidth: { true: "flex w-full", false: "" } },
  defaultVariants: { fullWidth: true },
});

export interface SegmentedControlRootProps {
  value: string;
  onValueChange: (value: string) => void;
  "aria-label": string;
  // 같은 목록을 거르는 자리에 쓴다. 칸이 5개를 넘거나 패널을 갈아끼우면 Tabs를 쓴다.
  size?: "sm" | "md";
  fullWidth?: boolean;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}

export function SegmentedControlRoot({
  value,
  onValueChange,
  "aria-label": ariaLabel,
  size = "md",
  fullWidth = true,
  disabled = false,
  className,
  children,
}: SegmentedControlRootProps) {
  const items = useRef(new Map<string, HTMLButtonElement>());
  const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null);

  const register = useCallback((itemValue: string, element: HTMLButtonElement | null) => {
    if (element) items.current.set(itemValue, element);
    else items.current.delete(itemValue);
  }, []);

  useLayoutEffect(() => {
    const element = items.current.get(value);
    if (!element) return setIndicator(null);
    const measure = () => setIndicator({ left: element.offsetLeft, width: element.offsetWidth });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [value, children]);

  // ←→로 옮기면 그 자리에서 바로 골라진다. 필터라서 고르는 즉시 결과가 바뀌는 게 자연스럽다.
  function move(event: KeyboardEvent<HTMLDivElement>) {
    const step = event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    if (!step || disabled) return;
    event.preventDefault();
    const values = [...items.current.entries()].filter(([, element]) => !element.disabled);
    const index = values.findIndex(([itemValue]) => itemValue === value);
    const next = values[(index + step + values.length) % values.length];
    if (!next) return;
    onValueChange(next[0]);
    next[1].focus();
  }

  return (
    <SegmentedControlContext.Provider
      value={{ value, setValue: onValueChange, size, fullWidth, disabled, register }}
    >
      <div
        role="radiogroup"
        aria-label={ariaLabel}
        data-slot="segmented-control"
        data-size={size}
        onKeyDown={move}
        className={cn(root({ fullWidth }), className)}
      >
        {indicator && (
          <span
            aria-hidden
            data-slot="segmented-control-indicator"
            className="absolute top-050 bottom-050 left-0 rounded-300 bg-surface shadow-sm transition-[translate,width] duration-(--rc-duration-fast) ease-(--rc-ease-out)"
            style={{ translate: `${indicator.left}px`, width: indicator.width }}
          />
        )}
        {children}
      </div>
    </SegmentedControlContext.Provider>
  );
}
