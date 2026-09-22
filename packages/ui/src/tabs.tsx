import { Tabs as BaseTabs } from "@base-ui-components/react/tabs";

import { TabsIndicator } from "./tabs-indicator";
import { TabsList } from "./tabs-list";
import { TabsPanel } from "./tabs-panel";
import { TabsTrigger } from "./tabs-trigger";

export type { TabsListProps } from "./tabs-list";
export type { TabsTriggerProps } from "./tabs-trigger";
export type { TabsPanelProps } from "./tabs-panel";

// 다른 콘텐츠를 갈아끼울 때 쓴다. 같은 목록을 거르는 자리에는 SegmentedControl을 쓴다.
export const Tabs = {
  Root: BaseTabs.Root,
  List: TabsList,
  Trigger: TabsTrigger,
  Indicator: TabsIndicator,
  Panel: TabsPanel,
};
