import { isFunction } from "es-toolkit";

export function resolveStateProp<State, Value>({
  prop,
  state,
}: {
  prop: Value | ((state: State) => Value | undefined) | undefined;
  state: State;
}): Value | undefined {
  return isFunction(prop) ? (prop as (state: State) => Value | undefined)(state) : prop;
}
