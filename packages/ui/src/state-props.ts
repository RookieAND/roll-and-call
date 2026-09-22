import type { useRender } from "@base-ui-components/react/use-render";
import type { ComponentPropsWithRef, CSSProperties, ElementType } from "react";

export type StateClassName<State> = string | ((state: State) => string | undefined);

export type StateStyle<State> = CSSProperties | ((state: State) => CSSProperties | undefined);

export interface StateProps<State> {
  className?: StateClassName<State>;
  style?: StateStyle<State>;
  render?: useRender.RenderProp<State>;
}

export type StateComponentProps<Tag extends ElementType, State> = Omit<
  ComponentPropsWithRef<Tag>,
  "className" | "style"
> &
  StateProps<State>;
