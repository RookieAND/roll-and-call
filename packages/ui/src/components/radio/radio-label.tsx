import { ControlLabel, type ControlLabelProps } from "../control-label/control-label";

export type RadioLabelProps = Omit<ControlLabelProps, "slot">;

export function RadioLabel(props: RadioLabelProps) {
  return <ControlLabel slot="radio-label" {...props} />;
}
