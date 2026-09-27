import { RichText } from "@roll-and-call/tiptap";
import { Text, VStack } from "@roll-and-call/ui";

interface GameNoticeBlockProps {
  notice: string;
}

export function GameNoticeBlock({ notice }: GameNoticeBlockProps) {
  return (
    <VStack gap="075">
      <Text typography="subtitle2" render={<h2 />}>
        주의 사항
      </Text>
      <Text
        typography="body3"
        foreground="muted"
        render={<RichText value={notice} />}
        className="[text-wrap:pretty]"
      />
    </VStack>
  );
}
