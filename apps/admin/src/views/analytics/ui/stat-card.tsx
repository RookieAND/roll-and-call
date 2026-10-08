import { Text, VStack } from "@roll-and-call/ui";

interface StatCardProps {
  label: string;
  value: string;
  sub: string;
}

export function StatCard({ label, value, sub }: StatCardProps) {
  return (
    <VStack gap="025" className="rounded-400 border border-gray-200 px-150 py-125">
      <Text typography="body4" foreground="muted">
        {label}
      </Text>
      <Text typography="subtitle2" numeric>
        {value}
      </Text>
      <Text typography="body5" foreground="hint">
        {sub}
      </Text>
    </VStack>
  );
}
