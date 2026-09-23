import { Button, HStack, Text } from "@roll-and-call/ui";
import Link from "next/link";

interface MyPageBlockLabelProps {
  label: string;
  action?: { href: string; label: string };
}

export function MyPageBlockLabel({ label, action }: MyPageBlockLabelProps) {
  return (
    <HStack align="center" className="mb-100 min-h-8">
      <Text weight="bold" typography="body4" foreground="muted" render={<h2 />} className="flex-1">
        {label}
      </Text>
      {action && (
        <Button
          render={<Link href={action.href} />}
          variant="ghost"
          colorPalette="primary"
          size="sm"
          className="-mr-100"
        >
          {action.label}
        </Button>
      )}
    </HStack>
  );
}
