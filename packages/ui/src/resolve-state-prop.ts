export function resolveStateProp<State, Value>(
  prop: Value | ((state: State) => Value | undefined) | undefined,
  state: State,
): Value | undefined {
  return typeof prop === "function" ? (prop as (state: State) => Value | undefined)(state) : prop;
}
