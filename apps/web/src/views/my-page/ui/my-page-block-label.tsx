import { HStack, Text } from "@roll-and-call/ui";

interface MyPageBlockLabelProps {
  label: string;
}

export function MyPageBlockLabel({ label }: MyPageBlockLabelProps) {
  return (
    <HStack align="center" className="mb-100 min-h-8">
      <Text weight="bold" typography="body4" foreground="muted" render={<h2 />} className="flex-1">
        {label}
      </Text>
    </HStack>
  );
}
