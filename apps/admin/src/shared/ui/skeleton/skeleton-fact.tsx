import { Skeleton } from "@roll-and-call/ui";

// FactRows의 items에 넣는 자리표시 한 줄.
export const skeletonFact = (label: string) => ({
  label,
  value: <Skeleton width={96} height={14} render={<span />} className="inline-block" />,
});
