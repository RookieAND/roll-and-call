import { HStack, Sheet, Text } from "@roll-and-call/ui";

interface RosterSheetTitleProps {
  title: string;
  count?: number;
}

export function RosterSheetTitle({ title, count }: RosterSheetTitleProps) {
  return (
    <HStack align="baseline" gap="075" className="mb-150">
      <Sheet.Title className="mb-0">{title}</Sheet.Title>
      {count !== undefined && (
        <Text numeric typography="subtitle2" foreground="hint">
          {count}명
        </Text>
      )}
    </HStack>
  );
}
