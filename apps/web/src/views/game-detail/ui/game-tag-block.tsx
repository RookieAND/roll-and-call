import { Chip, HStack, Text, VStack } from "@trpg/ui";

export function GameTagBlock({
  label,
  tags,
  note,
}: {
  label: string;
  tags: string[];
  note?: string;
}) {
  return (
    <VStack gap="100">
      <Text typography="heading3" render={<h2 />}>
        {label}
      </Text>
      <HStack gap="075" wrap>
        {tags.map((tag) => (
          <Chip key={tag} asChild>
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
