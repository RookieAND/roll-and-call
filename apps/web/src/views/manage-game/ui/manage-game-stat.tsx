import { Card, Text, VStack } from "@trpg/ui";

export function ManageGameStat({ label, value }: { label: string; value: string }) {
  return (
    <Card padding="none" className="rounded-500 px-150 py-125">
      <VStack gap="050">
        <Text typography="body4" foreground="muted">
          {label}
        </Text>
        <Text numeric truncate typography="subtitle1" weight="extrabold">
          {value}
        </Text>
      </VStack>
    </Card>
  );
}
