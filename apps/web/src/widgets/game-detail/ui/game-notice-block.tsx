import { RichText } from "@roll-and-call/tiptap";
import { Text, VStack } from "@roll-and-call/ui";

interface GameNoticeBlockProps {
  notice: string;
  linkLabels: Record<string, string>;
}

export function GameNoticeBlock({ notice, linkLabels }: GameNoticeBlockProps) {
  return (
    <VStack gap="075">
      <Text typography="subtitle2" render={<h2 />}>
        주의 사항
      </Text>
      <Text
        typography="body3"
        foreground="muted"
        render={<RichText value={notice} linkLabels={linkLabels} />}
        className="[text-wrap:pretty]"
      />
    </VStack>
  );
}
