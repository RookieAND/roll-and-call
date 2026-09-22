import { FieldDescription } from "./field-description";
import { FieldError } from "./field-error";
import { FieldLabel } from "./field-label";
import { FieldRoot } from "./field-root";

export type { FieldRootProps } from "./field-root";

// Root가 label·description·error를 그대로 받는다. 체크박스·스위치처럼 라벨을 직접 조립할 때만 조각을 쓴다.
export const Field = {
  Root: FieldRoot,
  Label: FieldLabel,
  Description: FieldDescription,
  Error: FieldError,
};
