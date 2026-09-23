import { Popover as BasePopover } from "@base-ui-components/react/popover";

import { PopoverArrow } from "./popover-arrow";
import { PopoverPopup } from "./popover-popup";

export type { PopoverPopupProps } from "./popover-popup";

// 눌러서 여는 작은 창. 포커스를 가져가고 ESC로 닫히며 트리거로 돌아온다.
// 필수 정보는 Popover가 아니라 화면에 둔다.
export const Popover = {
  Root: BasePopover.Root,
  Trigger: BasePopover.Trigger,
  Popup: PopoverPopup,
  Arrow: PopoverArrow,
  Title: BasePopover.Title,
  Description: BasePopover.Description,
  Close: BasePopover.Close,
};
