import { cn } from "@roll-and-call/ui";
import { Info } from "lucide-react";

import { ServerLink } from "@/shared/ui";

interface ScoreRuleLinkProps {
  className?: string;
}

export function ScoreRuleLink({ className }: ScoreRuleLinkProps) {
  return (
    <ServerLink
      path="/help/monthly-score"
      aria-label="점수 기준은 도움말에서 보기"
      className={cn(
        "flex size-11 flex-none items-center justify-center text-hint transition-colors hover:text-muted focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none",
        className,
      )}
    >
      <Info size={18} aria-hidden />
    </ServerLink>
  );
}
