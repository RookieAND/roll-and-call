import { Button } from "@roll-and-call/ui";

import { DecisionCard } from "./decision-card";

interface RejectCardProps {
  disabled: boolean;
  onReject?: () => void;
}

export function RejectCard({ disabled, onReject }: RejectCardProps) {
  return (
    <DecisionCard title="반려" description="사유를 골라 신청자에게 알립니다.">
      <Button
        variant="outline"
        colorPalette="danger"
        className="w-full"
        disabled={disabled}
        onClick={onReject}
      >
        반려
      </Button>
    </DecisionCard>
  );
}
