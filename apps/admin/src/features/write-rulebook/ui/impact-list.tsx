import { Text, VStack } from "@roll-and-call/ui";

interface ImpactListProps {
  label: string;
  rows: { id: string; title: string; meta: string }[];
}

export function ImpactList({ label, rows }: ImpactListProps) {
  return (
    <VStack gap="075">
      <Text typography="body4" weight="bold">
        {label}
      </Text>
      <VStack
        render={<ul />}
        className="overflow-hidden rounded-400 border border-gray-200 bg-surface"
      >
        {rows.map((row) => (
          <VStack
            key={row.id}
            gap="025"
            render={<li />}
            className="border-t border-(--rc-color-border-subtle) px-150 py-125 first:border-t-0"
          >
            <Text typography="subtitle2" truncate>
              {row.title}
            </Text>
            <Text typography="body4" foreground="hint" truncate>
              {row.meta}
            </Text>
          </VStack>
        ))}
      </VStack>
    </VStack>
  );
}
