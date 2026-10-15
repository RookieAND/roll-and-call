"use client";

import { Tabs as BaseTabs } from "@base-ui-components/react/tabs";
import { useEffect, useRef, useState, type ComponentPropsWithRef } from "react";

import { cn } from "../../lib/cn";
import { resolveStateProp } from "../../lib/resolve-state-prop";

export type TabsIndicatorProps = ComponentPropsWithRef<typeof BaseTabs.Indicator>;

// Base UI는 탭 목록 요소의 크기만 지켜봐서, 목록 크기가 그대로인 채 탭 크기가 바뀌면(웹폰트 교체, 건수 글자) 위치를 다시 재지 않는다.
// 탭 크기가 바뀌면 key를 바꿔 다시 그려 위치를 새로 잰다. 다시 그린 자리는 바로 맞는 위치에서 시작한다.
export function TabsIndicator({ className, ref, ...props }: TabsIndicatorProps) {
  const [version, setVersion] = useState(0);
  const element = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const list = element.current?.parentElement;
    if (!list || typeof ResizeObserver === "undefined") return;
    const sizes = new WeakMap<Element, string>();
    const observer = new ResizeObserver((entries) => {
      let changed = false;
      for (const entry of entries) {
        const [box] = entry.borderBoxSize;
        if (!box) continue;
        const size = `${box.inlineSize}x${box.blockSize}`;
        const previous = sizes.get(entry.target);
        sizes.set(entry.target, size);
        if (previous !== undefined && previous !== size) changed = true;
      }
      if (changed) setVersion((current) => current + 1);
    });
    for (const tab of list.querySelectorAll('[role="tab"]'))
      observer.observe(tab, { box: "border-box" });
    return () => observer.disconnect();
  }, [version]);

  return (
    <BaseTabs.Indicator
      key={version}
      ref={(node) => {
        element.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      data-slot="tabs-indicator"
      className={(state) =>
        cn(
          "absolute bottom-0 left-0 h-0.5 in-data-[variant=solid]:hidden w-(--active-tab-width) translate-x-(--active-tab-left) bg-primary-600 transition-[translate,width] duration-(--rc-duration-fast) ease-(--rc-ease-out)",
          resolveStateProp({ prop: className, state }),
        )
      }
      {...props}
    />
  );
}
