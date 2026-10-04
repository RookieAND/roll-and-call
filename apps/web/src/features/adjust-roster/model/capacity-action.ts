export const CAPACITY_ACTION = {
  promote: "promote",
  add: "add",
} as const;

export type CapacityAction = (typeof CAPACITY_ACTION)[keyof typeof CAPACITY_ACTION];
