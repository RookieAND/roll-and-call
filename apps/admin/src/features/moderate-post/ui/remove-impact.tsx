import { Callout } from "@roll-and-call/ui";
import { TriangleAlert } from "lucide-react";

interface RemoveImpactProps {
  memberCount: number;
}

export function RemoveImpact({ memberCount }: RemoveImpactProps) {
  return (
    <Callout.Root colorPalette="danger" size="sm">
      <Callout.Icon>
        <TriangleAlert size={14} />
      </Callout.Icon>
      <Callout.Title>되돌릴 수 없습니다</Callout.Title>
      <Callout.Description>
        참여자 {memberCount}명의 참여 정보와 후기가 함께 삭제됩니다
      </Callout.Description>
    </Callout.Root>
  );
}
