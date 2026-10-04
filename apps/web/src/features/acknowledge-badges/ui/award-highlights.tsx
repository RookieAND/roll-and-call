import { Button, HStack, Sheet, Text, VStack } from "@roll-and-call/ui";
import { ChevronRight } from "lucide-react";

import { BadgeMedal, BadgePill } from "@/entities/badge";
import { ServerLink } from "@/shared/ui";

import { AWARD_SHEET_KIND, type AwardSheet } from "../model/award-sheet";
import { AwardRays } from "./award-rays";

const HEADING = {
  [AWARD_SHEET_KIND.hidden]: "숨겨진 칭호를 찾았습니다",
  [AWARD_SHEET_KIND.first]: "첫 뱃지를 받았습니다",
} as const;

interface AwardHighlightsProps {
  sheet: Exclude<AwardSheet, { kind: typeof AWARD_SHEET_KIND.retro }>;
  onNavigate: () => void;
}

export function AwardHighlights({ sheet, onNavigate }: AwardHighlightsProps) {
  const hidden = sheet.kind === AWARD_SHEET_KIND.hidden;
  const medalSize = sheet.highlights.length > 1 ? "xl" : "2xl";
  const headingForeground = hidden ? "inherit" : "primary";
  const headingClass = hidden ? "text-rank-gold" : undefined;
  return (
    <VStack align="center" gap="175" className="relative pt-225 text-center">
      <span className="relative">
        <AwardRays gold={hidden} />
        <HStack gap="200" className="relative">
          {sheet.highlights.map((item) => (
            <BadgeMedal key={item.key} emoji={item.emoji} look={item.look} size={medalSize} />
          ))}
        </HStack>
      </span>
      <VStack align="center" gap="075" className="relative mt-075">
        <Text
          typography="body3"
          weight="extrabold"
          foreground={headingForeground}
          className={headingClass}
        >
          {HEADING[sheet.kind]}
        </Text>
        <Sheet.Title render={<Text typography="heading1" render={<h2 />} />}>
          {sheet.highlights.map((item) => item.name).join(" · ")}
        </Sheet.Title>
        <VStack>
          {sheet.highlights.map((item) => (
            <Text
              key={item.key}
              typography="body2"
              foreground="muted"
              className="[text-wrap:pretty]"
            >
              {item.line}
            </Text>
          ))}
          {!hidden && (
            <Text typography="body2" foreground="muted">
              세션을 마칠 때마다 업적이 쌓입니다.
            </Text>
          )}
        </VStack>
      </VStack>
      {!hidden &&
        sheet.highlights.map(
          (item) =>
            item.source && (
              <Button
                key={item.key}
                render={<ServerLink path={item.source.href} onClick={onNavigate} />}
                variant="tinted"
                colorPalette="gray"
                size="sm"
                className="relative rounded-full"
              >
                {item.source.label}
                <ChevronRight size={12} aria-hidden />
              </Button>
            ),
        )}
      {sheet.chips.length > 0 && (
        <HStack gap="075" wrap justify="center" render={<ul />} className="relative">
          {sheet.chips.map((chip) => (
            <li key={chip.key}>
              <BadgePill emoji={chip.emoji} name={chip.name} look={chip.look} size="sm" />
            </li>
          ))}
        </HStack>
      )}
    </VStack>
  );
}
