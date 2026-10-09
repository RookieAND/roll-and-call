import { HStack } from "@roll-and-call/ui";
import { ArrowDown } from "lucide-react";

import type { SkeletonColumn } from "./skeleton-table";

interface SkeletonHeadLabelProps {
  column: SkeletonColumn;
}

export function SkeletonHeadLabel({ column }: SkeletonHeadLabelProps) {
  if (column.label) {
    return (
      <HStack inline align="center" gap="050">
        {column.label}
        {column.sorted ? <ArrowDown size={10} strokeWidth={2.4} aria-hidden /> : null}
      </HStack>
    );
  }
  if (column.kind === "empty") return null;
  return <span className="sr-only">조치</span>;
}
