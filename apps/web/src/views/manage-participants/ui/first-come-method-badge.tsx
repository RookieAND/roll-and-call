import { Badge } from "@trpg/ui";

interface FirstComeMethodBadgeProps {
  label: string;
}

export function FirstComeMethodBadge({ label }: FirstComeMethodBadgeProps) {
  return (
    <Badge color="gray" className="shrink-0">
      {label}
    </Badge>
  );
}
