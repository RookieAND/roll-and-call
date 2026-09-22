import { Badge } from "@trpg/ui";

import { RECRUIT_METHOD, type RecruitMethod } from "../model/recruit-method";
import { recruitMethodLabel } from "../model/recruit-method-label";

interface RecruitMethodBadgeProps {
  method: RecruitMethod;
  label?: string;
}

// 추첨은 선착순과 접수 규칙이 달라 눈에 띄어야 한다.
export function RecruitMethodBadge({
  method,
  label = recruitMethodLabel(method),
}: RecruitMethodBadgeProps) {
  const color = method === RECRUIT_METHOD.lottery ? "primary" : "gray";
  return (
    <Badge color={color} className="shrink-0">
      {label}
    </Badge>
  );
}
