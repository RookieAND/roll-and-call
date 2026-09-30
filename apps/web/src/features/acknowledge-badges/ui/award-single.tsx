import { Button, Sheet, Text, VStack } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { BadgeMedal, TONE_CLASS } from "@/entities/badge";

import type { AwardSheet } from "../model/award-sheet";
import { AwardRays } from "./award-rays";

interface AwardSingleProps {
  sheet: Extract<AwardSheet, { kind: "single" }>;
  onNavigate: () => void;
}

export function AwardSingle({ sheet, onNavigate }: AwardSingleProps) {
  const { item } = sheet;
  return (
    <VStack align="center" gap="175" className="relative pt-225 text-center">
      <span className="relative">
        <AwardRays gold={sheet.gold} />
        <BadgeMedal emoji={item.emoji} look={item.look} ribbon={item.ribbon} size="2xl" />
      </span>
      <VStack align="center" gap="075" className="relative mt-075">
        <Text
          typography="body3"
          weight="extrabold"
          foreground="inherit"
          className={TONE_CLASS[item.tagTone]}
        >
          {item.tag}
        </Text>
        <Sheet.Title render={<Text typography="heading1" render={<h2 />} />}>
          {item.name}
        </Sheet.Title>
        <VStack>
          {sheet.lines.map((line) => (
            <Text key={line} typography="body2" foreground="muted">
              {line}
            </Text>
          ))}
        </VStack>
      </VStack>
      {sheet.source && (
        <Button
          render={<Link href={sheet.source.href} onClick={onNavigate} />}
          variant="tinted"
          colorPalette="gray"
          size="sm"
          className="relative rounded-full"
        >
          {sheet.source.label}
          <ChevronRight size={12} aria-hidden />
        </Button>
      )}
    </VStack>
  );
}
