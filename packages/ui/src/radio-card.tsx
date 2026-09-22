import { RadioCardDescription } from "./radio-card-description";
import { RadioCardIndicator } from "./radio-card-indicator";
import { RadioCardMeta } from "./radio-card-meta";
import { RadioCardRoot } from "./radio-card-root";
import { RadioCardTitle } from "./radio-card-title";

export type { RadioCardRootProps } from "./radio-card-root";
export type { RadioCardIndicator } from "./radio-card-context";

// RadioGroup 안에서만 쓴다. 후보 몇 개 중 하나를 고르는 자리(모집 방식, 확정할 일정)가 제자리다.
export const RadioCard = {
  Root: RadioCardRoot,
  Indicator: RadioCardIndicator,
  Title: RadioCardTitle,
  Description: RadioCardDescription,
  Meta: RadioCardMeta,
};
