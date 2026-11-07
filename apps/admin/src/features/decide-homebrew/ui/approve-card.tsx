import { Button } from "@roll-and-call/ui";

import { DecisionCard } from "./decision-card";

interface ApproveCardProps {
  disabled: boolean;
  onApprove?: () => void;
}

export function ApproveCard({ disabled, onApprove }: ApproveCardProps) {
  return (
    <DecisionCard title="승인" description="서버 룰북으로 등록되고 제작자에게 알립니다.">
      <Button colorPalette="success" className="w-full" disabled={disabled} onClick={onApprove}>
        승인
      </Button>
    </DecisionCard>
  );
}
