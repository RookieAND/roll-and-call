import { Text, VStack } from "@roll-and-call/ui";
import { cva } from "class-variance-authority";

import type { AuditState } from "@/shared/server";

const box = cva("min-w-0 flex-1 rounded-400 border px-150 py-125", {
  variants: {
    tone: {
      normal: "border-gray-200",
      danger: "border-danger-600 bg-danger-50 text-danger-600",
      success: "border-success-200 bg-success-50",
    },
  },
  defaultVariants: { tone: "normal" },
});

interface StateBoxProps {
  label: string;
  state: AuditState;
  tone?: "normal" | "danger" | "success";
}

export function StateBox({ label, state, tone = "normal" }: StateBoxProps) {
  const foreground = tone === "danger" ? "inherit" : "hint";
  return (
    <VStack gap="025" className={box({ tone })}>
      <Text typography="body4" foreground={foreground}>
        {label}
      </Text>
      <Text typography="body3" weight="bold" foreground={tone === "danger" ? "inherit" : "normal"}>
        {state.label}
      </Text>
      {state.sub ? (
        <Text typography="body4" foreground={foreground}>
          {state.sub}
        </Text>
      ) : null}
    </VStack>
  );
}
