import { Chip, Text } from "@roll-and-call/ui";

import { ServerLink } from "@/shared/ui";

interface GroupBookChipProps {
  label: string;
  href: string;
}

export function GroupBookChip({ label, href }: GroupBookChipProps) {
  return (
    <Chip
      tone="neutral"
      className="h-7 max-w-50 px-125 font-normal"
      render={<ServerLink path={href} title={label} />}
    >
      <Text typography="body4" foreground="inherit" truncate render={<span />}>
        {label}
      </Text>
    </Chip>
  );
}
