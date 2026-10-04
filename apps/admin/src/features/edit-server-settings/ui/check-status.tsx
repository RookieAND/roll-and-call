import { HStack, Text, VStack } from "@roll-and-call/ui";
import { CircleCheck, Clock, TriangleAlert } from "lucide-react";

import type { SettingCheck } from "../model/setting-check";
import { CHECKING_MESSAGE, settingCheckMessage } from "../model/setting-check-message";

interface CheckStatusProps {
  check: SettingCheck | "checking";
  serverName: string;
}

export function CheckStatus({ check, serverName }: CheckStatusProps) {
  if (check === "checking") {
    return (
      <HStack align="start" gap="075" role="status" className="text-hint">
        <Clock size={14} aria-hidden className="mt-025 shrink-0" />
        <Text typography="body4" foreground="hint">
          {CHECKING_MESSAGE}
        </Text>
      </HStack>
    );
  }
  const passed = check.status === "ok";
  const Icon = passed ? CircleCheck : TriangleAlert;
  const foreground = passed ? "success" : "danger";
  const message = settingCheckMessage({ check, serverName });
  return (
    <HStack
      align="start"
      gap="075"
      role="status"
      className={passed ? "text-success-700" : "text-danger-600"}
    >
      <Icon size={14} aria-hidden className="mt-025 shrink-0" />
      <VStack>
        <Text typography="body4" foreground={foreground} weight="bold">
          {message.title}
        </Text>
        {message.description ? (
          <Text typography="body4" foreground="muted">
            {message.description}
          </Text>
        ) : null}
      </VStack>
    </HStack>
  );
}
