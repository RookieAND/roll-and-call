import { RadioCardDescription } from "./radio-card-description";
import { RadioCardIndicator } from "./radio-card-indicator";
import { RadioCardMeta } from "./radio-card-meta";
import { RadioCardRoot } from "./radio-card-root";
import { RadioCardTitle } from "./radio-card-title";

export type { RadioCardRootProps } from "./radio-card-root";
export type { RadioCardIndicator } from "./radio-card-context";

// RadioGroup 안에서만 쓴다.
export const RadioCard = {
  Root: RadioCardRoot,
  Indicator: RadioCardIndicator,
  Title: RadioCardTitle,
  Description: RadioCardDescription,
  Meta: RadioCardMeta,
};
