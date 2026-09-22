import { ControlLabel, type ControlLabelProps } from "./control-label";

export type CheckboxLabelProps = Omit<ControlLabelProps, "slot">;

export function CheckboxLabel(props: CheckboxLabelProps) {
  return <ControlLabel slot="checkbox-label" {...props} />;
}
