"use client";

import { CollapsiblePanel } from "./collapsible-panel";
import { CollapsibleRoot } from "./collapsible-root";
import { CollapsibleTrigger } from "./collapsible-trigger";

export type { CollapsiblePanelProps } from "./collapsible-panel";

export const Collapsible = {
  Root: CollapsibleRoot,
  Trigger: CollapsibleTrigger,
  Panel: CollapsiblePanel,
};
