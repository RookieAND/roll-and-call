import { FieldDescription } from "./field-description";
import { FieldError } from "./field-error";
import { FieldLabel } from "./field-label";
import { FieldRoot } from "./field-root";

export type { FieldRootProps } from "./field-root";

export const Field = {
  Root: FieldRoot,
  Label: FieldLabel,
  Description: FieldDescription,
  Error: FieldError,
};
