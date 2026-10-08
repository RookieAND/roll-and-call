import { Chip, HStack, Text, VStack, type ChipProps } from "@roll-and-call/ui";

import { LineBreaks } from "@/shared/ui";

interface GameTagBlockProps {
  label: string;
  tags: string[];
  noteLines?: readonly string[];
  tone?: ChipProps["tone"];
}

export function GameTagBlock({ label, tags, noteLines, tone = "outline" }: GameTagBlockProps) {
  return (
    <VStack gap="100">
      <Text typography="subtitle2" render={<h2 />}>
        {label}
      </Text>
      <HStack gap="075" wrap>
        {tags.map((tag) => (
          <Chip key={tag} tone={tone} render={<span />}>
            {tag}
          </Chip>
        ))}
      </HStack>
      {noteLines && (
        <Text typography="body4" foreground="hint" render={<p />} className="break-keep">
          <LineBreaks lines={noteLines} />
        </Text>
      )}
    </VStack>
  );
}
