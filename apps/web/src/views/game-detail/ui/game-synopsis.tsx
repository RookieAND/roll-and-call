import { RichText } from "@roll-and-call/tiptap";
import { Text, VStack } from "@roll-and-call/ui";

interface GameSynopsisProps {
  synopsis: string;
}

export function GameSynopsis({ synopsis }: GameSynopsisProps) {
  return (
    <VStack gap="100">
      <Text typography="heading3" render={<h2 />}>
        시놉시스
      </Text>
      <Text typography="body3" foreground="muted" render={<RichText value={synopsis} />} />
    </VStack>
  );
}
