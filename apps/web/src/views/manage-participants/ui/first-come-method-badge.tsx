import { Badge } from "@trpg/ui";

export function FirstComeMethodBadge({ label }: { label: string }) {
  return (
    <Badge color="gray" className="shrink-0">
      {label}
    </Badge>
  );
}
