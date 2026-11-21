import { Badge, Text } from "@roll-and-call/ui";

interface UserTitleBadgeProps {
  title: string;
}

export function UserTitleBadge({ title }: UserTitleBadgeProps) {
  return (
    <Badge colorPalette="primary" className="max-w-32 min-w-0 shrink desktop:max-w-40">
      <Text truncate typography="body4" weight="bold" foreground="inherit" tight>
        {title}
      </Text>
    </Badge>
  );
}
