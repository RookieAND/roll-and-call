import { VStack } from "@roll-and-call/ui";
import type { ComponentProps } from "react";

import { NotificationPreview } from "@/shared/ui";

import { RejectPanel } from "./reject-panel";

interface RejectSectionProps {
  ebook: boolean;
  reason: string;
  userReason: string;
  staffMemo: string;
  previewPayload: ComponentProps<typeof NotificationPreview>["payload"];
  onReasonChange: (reason: string) => void;
  onUserReasonChange: (userReason: string) => void;
  onStaffMemoChange: (staffMemo: string) => void;
}

export function RejectSection({ previewPayload, ...panelProps }: RejectSectionProps) {
  return (
    <VStack gap="150">
      <RejectPanel {...panelProps} />
      <NotificationPreview payload={previewPayload} recipients="신청자의 알림 탭으로 알립니다." />
    </VStack>
  );
}
