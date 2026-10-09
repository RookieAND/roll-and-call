"use client";

import { RichText } from "@roll-and-call/tiptap";
import { Button, Text, VStack, cn } from "@roll-and-call/ui";
import { useLayoutEffect, useRef, useState } from "react";

const CLAMP_CLASS = { 2: "line-clamp-2", 3: "line-clamp-3" } as const;

interface ReviewBodyProps {
  body: string;
  lines?: 2 | 3;
  muted?: boolean;
}

export function ReviewBody({ body, lines = 3, muted = false }: ReviewBodyProps) {
  const [expanded, setExpanded] = useState(false);
  const [clamped, setClamped] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const long = expanded || clamped;
  const clampClass = expanded ? "" : CLAMP_CLASS[lines];

  // 글자 수로는 줄바꿈·긴 낱말을 못 잡아, 실제로 잘렸는지를 잰다. 펼친 동안은 재지 않고 버튼을 유지한다.
  useLayoutEffect(() => {
    const element = bodyRef.current?.firstElementChild;
    if (!element || expanded) return;
    const measure = () => setClamped(element.scrollHeight > element.clientHeight + 1);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => observer.disconnect();
  }, [body, lines, expanded]);

  const foreground = muted ? "muted" : "normal";

  return (
    <VStack gap="025" align="start">
      <div ref={bodyRef} className="w-full">
        <Text
          typography="body3"
          foreground={foreground}
          render={<RichText value={body} />}
          className={cn("leading-[1.65] text-pretty", clampClass)}
        />
      </div>
      {long && (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-100"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? "접기" : "더 보기"}
        </Button>
      )}
    </VStack>
  );
}
