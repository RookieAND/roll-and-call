import { Text, VStack } from "@roll-and-call/ui";

interface StatTileProps {
  label: string;
  value: string;
  tone?: "normal" | "success" | "danger";
  sub?: string;
}

export function StatTile({ label, value, tone = "normal", sub }: StatTileProps) {
  return (
    <VStack gap="025" className="min-w-0 rounded-400 border border-gray-200 px-150 py-125">
      <Text typography="body4" foreground="hint" truncate>
        {label}
      </Text>
      <Text typography="heading3" weight="extrabold" foreground={tone} numeric>
        {value}
      </Text>
      {sub ? (
        <Text typography="body4" foreground="hint" truncate>
          {sub}
        </Text>
      ) : null}
    </VStack>
  );
}
