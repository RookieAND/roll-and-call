import { Card, Progress, Text, VStack } from "@roll-and-call/ui";

interface UploadingMessageProps {
  percent: number;
}

export function UploadingMessage({ percent }: UploadingMessageProps) {
  return (
    <Card.Root background="subtle" padding="sm" radius={500}>
      <VStack gap="100" className="p-025">
        <Progress value={percent} colorPalette="primary" aria-label="올리는 중" />
        <Text numeric typography="body4" foreground="muted">
          올리는 중 {percent}%
        </Text>
      </VStack>
    </Card.Root>
  );
}
