import { Text, VStack } from "@roll-and-call/ui";
import { cva } from "class-variance-authority";

import type { AuditState } from "@/shared/server";

const box = cva("rounded-400 border px-150 py-125", {
  variants: {
    danger: {
      true: "border-danger-600 bg-danger-50 text-danger-600",
      false: "border-gray-200 bg-surface",
    },
  },
});

interface MobileStateBoxProps {
  label: string;
  state: AuditState;
  danger?: boolean;
}

export function MobileStateBox({ label, state, danger = false }: MobileStateBoxProps) {
  const foreground = danger ? "inherit" : "hint";
  return (
    <VStack gap="025" className={box({ danger })}>
      <Text typography="body4" foreground={foreground}>
        {label}
      </Text>
      <Text typography="subtitle1" foreground={danger ? "inherit" : "normal"}>
        {state.label}
      </Text>
      {state.sub ? (
        <Text typography="body4" foreground={danger ? "inherit" : "muted"}>
          {state.sub}
        </Text>
      ) : null}
    </VStack>
  );
}
