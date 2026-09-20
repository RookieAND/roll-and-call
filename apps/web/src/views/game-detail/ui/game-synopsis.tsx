import { RichText } from "@trpg/tiptap";
import { Text, VStack } from "@trpg/ui";

export function GameSynopsis({ synopsis }: { synopsis: string }) {
  return (
    <VStack gap="100">
      <Text typography="heading3" render={<h2 />}>
        시놉시스
      </Text>
      <Text typography="body3" foreground="muted" render={<RichText value={synopsis} />} />
    </VStack>
  );
}
