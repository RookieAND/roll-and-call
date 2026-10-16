import { RichText } from "@roll-and-call/tiptap/viewer";
import { Text, VStack } from "@roll-and-call/ui";

interface GameSynopsisProps {
  synopsis: string;
}

export function GameSynopsis({ synopsis }: GameSynopsisProps) {
  return (
    <VStack gap="075">
      <Text typography="subtitle2" className="desktop:text-heading2" render={<h2 />}>
        시놉시스
      </Text>
      <Text
        typography="body2"
        render={<RichText value={synopsis} />}
        className="[text-wrap:pretty] desktop:text-heading3"
      />
    </VStack>
  );
}
