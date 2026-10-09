"use client";

import { useLayoutEffect, useRef, useState } from "react";

const CHART_TOKEN_VARIABLES = {
  primary: "--rc-color-bg-primary",
  primaryWeak: "--rc-color-bg-primary-weak",
  heat1: "--rc-color-heat-1",
  heat2: "--rc-color-heat-2",
  heat3: "--rc-color-heat-3",
  base: "--rc-color-bg-canvas-base",
  normal: "--rc-color-fg-normal",
  muted: "--rc-color-fg-muted",
  hint: "--rc-color-fg-hint",
  line: "--rc-color-border-normal",
  grid: "--rc-color-border-subtle",
  strong: "--rc-color-border-strong",
  font: "--font-sans",
} as const;

export type ChartTokens = Record<keyof typeof CHART_TOKEN_VARIABLES, string>;

// 차트 라이브러리는 CSS 변수를 못 읽어서, 그릴 자리의 계산된 값을 꺼내 넘긴다.
// 테마를 바꾸면 <html data-theme>가 달라지므로 그 변화를 구독해 다시 읽는다.
export function useChartTokens<Element extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<Element>(null);
  const [tokens, setTokens] = useState<ChartTokens | null>(null);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    function read() {
      const style = getComputedStyle(element!);
      setTokens(
        Object.fromEntries(
          Object.entries(CHART_TOKEN_VARIABLES).map(([key, variable]) => [
            key,
            style.getPropertyValue(variable).trim(),
          ]),
        ) as ChartTokens,
      );
    }
    read();
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);
  return { ref, tokens };
}
