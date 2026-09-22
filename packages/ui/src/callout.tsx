import { CalloutAction } from "./callout-action";
import { CalloutDescription } from "./callout-description";
import { CalloutIcon } from "./callout-icon";
import { CalloutRoot } from "./callout-root";
import { CalloutTitle } from "./callout-title";

export type { CalloutRootProps } from "./callout-root";
export type { CalloutPalette } from "./callout-context";

export const Callout = {
  Root: CalloutRoot,
  Icon: CalloutIcon,
  Title: CalloutTitle,
  Description: CalloutDescription,
  Action: CalloutAction,
};
