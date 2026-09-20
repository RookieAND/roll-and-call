import { Chip, HStack, Text, VStack, type ChipProps } from "@trpg/ui";

interface GameTagBlockProps {
  label: string;
  tags: string[];
  note?: string;
  tone?: ChipProps["tone"];
}

export function GameTagBlock({ label, tags, note, tone = "outline" }: GameTagBlockProps) {
  return (
    <VStack gap="100">
      <Text typography="heading3" render={<h2 />}>
        {label}
      </Text>
      <HStack gap="075" wrap>
        {tags.map((tag) => (
          <Chip key={tag} tone={tone} asChild>
            <span>{tag}</span>
          </Chip>
        ))}
      </HStack>
      {note && (
        <Text typography="body4" foreground="hint" render={<p />}>
          {note}
        </Text>
      )}
    </VStack>
  );
}
