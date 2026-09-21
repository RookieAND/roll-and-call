"use client";

import { Collapsible as BaseCollapsible } from "@base-ui-components/react/collapsible";

import { CollapsiblePanel } from "./collapsible-panel";

export type { CollapsiblePanelProps } from "./collapsible-panel";

// vapor-ui Collapsible과 같은 Root · Trigger · Panel 세 조각. 열린 상태는 Trigger의 data-panel-open으로 꾸민다.
export const Collapsible = {
  Root: BaseCollapsible.Root,
  Trigger: BaseCollapsible.Trigger,
  Panel: CollapsiblePanel,
};
