"use client";

import { Select as BaseSelect } from "@base-ui-components/react/select";

import { SelectItem } from "./select-item";
import { SelectPopup } from "./select-popup";
import { SelectRoot } from "./select-root";
import { SelectTrigger } from "./select-trigger";

export type { SelectOption } from "./select-items-context";
export type { SelectRootProps } from "./select-root";
export type { SelectTriggerProps } from "./select-trigger";

export const Select = {
  Root: SelectRoot,
  Trigger: SelectTrigger,
  Popup: SelectPopup,
  Item: SelectItem,
  Value: BaseSelect.Value,
  Icon: BaseSelect.Icon,
  Group: BaseSelect.Group,
  GroupLabel: BaseSelect.GroupLabel,
  Separator: BaseSelect.Separator,
};
