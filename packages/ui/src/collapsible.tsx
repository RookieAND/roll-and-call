"use client";

import { CollapsiblePanel } from "./collapsible-panel";
import { CollapsibleRoot } from "./collapsible-root";
import { CollapsibleTrigger } from "./collapsible-trigger";

export type { CollapsiblePanelProps } from "./collapsible-panel";

// vapor-ui Collapsible과 같은 Root · Trigger · Panel 세 조각. 열린 상태는 Trigger의 data-panel-open으로 꾸민다.
export const Collapsible = {
  Root: CollapsibleRoot,
  Trigger: CollapsibleTrigger,
  Panel: CollapsiblePanel,
};
