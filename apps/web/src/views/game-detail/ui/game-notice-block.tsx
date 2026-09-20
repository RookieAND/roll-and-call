import { Text, VStack } from "@trpg/ui";

export function GameNoticeBlock({ notice }: { notice: string }) {
  return (
    <VStack gap="100">
      <Text typography="heading3" render={<h2 />}>
        주의 사항
      </Text>
      <Text typography="body3" foreground="muted" className="whitespace-pre-wrap">
        {notice}
      </Text>
    </VStack>
  );
}
