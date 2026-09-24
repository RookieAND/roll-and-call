import { HStack, Text } from "@roll-and-call/ui";
import type { LucideIcon } from "lucide-react";

interface FooterNoteProps {
  icon: LucideIcon;
  children: string;
}

export function FooterNote({ icon: Icon, children }: FooterNoteProps) {
  return (
    <HStack align="center" gap="075" className="mr-auto text-hint">
      <Icon size={14} aria-hidden />
      <Text typography="body4" foreground="hint">
        {children}
      </Text>
    </HStack>
  );
}
