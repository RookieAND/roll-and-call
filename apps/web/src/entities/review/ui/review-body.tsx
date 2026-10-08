"use client";

import { RichText } from "@roll-and-call/tiptap";
import { Button, Text, VStack } from "@roll-and-call/ui";
import { useState } from "react";

import { richTextLength } from "@/shared/lib";

// 세 줄을 넘길 만한 길이일 때만 펼치기를 단다. 줄 수를 재지 않는 어림값이다.
const LONG_BODY_LENGTH = 90;

const CLAMP_CLASS = { 2: "line-clamp-2", 3: "line-clamp-3" } as const;

interface ReviewBodyProps {
  body: string;
  lines?: 2 | 3;
  muted?: boolean;
}

export function ReviewBody({ body, lines = 3, muted = false }: ReviewBodyProps) {
  const [expanded, setExpanded] = useState(false);
  const long = richTextLength(body) > LONG_BODY_LENGTH;
  const clampClass = expanded ? "" : CLAMP_CLASS[lines];
  const foreground = muted ? "muted" : "normal";

  return (
    <VStack gap="025" align="start">
      <Text
        typography="body3"
        foreground={foreground}
        render={<RichText value={body} />}
        className={`leading-[1.65] [text-wrap:pretty] ${clampClass}`}
      />
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
