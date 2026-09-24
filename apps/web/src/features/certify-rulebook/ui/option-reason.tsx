import { HStack, Text } from "@roll-and-call/ui";
import type { LucideIcon } from "lucide-react";

interface OptionReasonProps {
  label: string;
  icon?: LucideIcon;
  foreground: "success" | "warning" | "hint";
}

export function OptionReason({ label, icon: Icon, foreground }: OptionReasonProps) {
  return (
    <HStack align="center" gap="050" className="flex-none">
      {Icon && <Icon size={13} strokeWidth={2.4} aria-hidden />}
      <Text typography="body4" weight="bold" foreground={foreground}>
        {label}
      </Text>
    </HStack>
  );
}
