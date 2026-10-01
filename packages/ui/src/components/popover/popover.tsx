import { Popover as BasePopover } from "@base-ui-components/react/popover";

import { PopoverArrow } from "./popover-arrow";
import { PopoverPopup } from "./popover-popup";

export type { PopoverPopupProps } from "./popover-popup";

export const Popover = {
  Root: BasePopover.Root,
  Trigger: BasePopover.Trigger,
  Popup: PopoverPopup,
  Arrow: PopoverArrow,
  Title: BasePopover.Title,
  Description: BasePopover.Description,
  Close: BasePopover.Close,
};
