import { Badge } from "@roll-and-call/ui";

import { RECRUIT_METHOD, type RecruitMethod } from "../model/recruit-method";
import { recruitMethodLabel } from "../model/recruit-method-label";

interface RecruitMethodBadgeProps {
  method: RecruitMethod;
  label?: string;
}

export function RecruitMethodBadge({
  method,
  label = recruitMethodLabel(method),
}: RecruitMethodBadgeProps) {
  const color = method === RECRUIT_METHOD.firstCome ? "gray" : "primary";
  return (
    <Badge colorPalette={color} className="shrink-0">
      {label}
    </Badge>
  );
}
