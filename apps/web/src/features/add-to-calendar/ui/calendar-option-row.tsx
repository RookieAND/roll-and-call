import { HStack, Sheet, Text } from "@roll-and-call/ui";

interface CalendarOptionRowProps {
  iconSrc: string;
  name: string;
  description: string;
  disabled?: boolean;
  onClick: () => void;
}

export function CalendarOptionRow({
  iconSrc,
  name,
  description,
  disabled,
  onClick,
}: CalendarOptionRowProps) {
  return (
    <Sheet.Item disabled={disabled} onClick={onClick} className="min-h-14 px-175">
      <HStack gap="150" align="center" render={<span />} className="min-w-0 flex-1">
        <img src={iconSrc} alt="" width={24} height={24} className="shrink-0" />
        <Text typography="subtitle2" className="min-w-0 flex-1">
          {name}
        </Text>
        <Text typography="body5" foreground="hint" className="shrink-0">
          {description}
        </Text>
      </HStack>
    </Sheet.Item>
  );
}
