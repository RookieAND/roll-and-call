import { CheckboxGroup as BaseCheckboxGroup } from "@base-ui-components/react/checkbox-group";

import { CheckboxContent } from "./checkbox-content";
import { CheckboxDescription } from "./checkbox-description";
import { CheckboxField } from "./checkbox-field";
import { CheckboxIndicator } from "./checkbox-indicator";
import { CheckboxLabel } from "./checkbox-label";
import { CheckboxRoot } from "./checkbox-root";

export type { CheckboxRootProps } from "./checkbox-root";

export const Checkbox = {
  Root: CheckboxRoot,
  Indicator: CheckboxIndicator,
  Label: CheckboxLabel,
  Field: CheckboxField,
  Content: CheckboxContent,
  Description: CheckboxDescription,
};

export const CheckboxGroup = { Root: BaseCheckboxGroup };
