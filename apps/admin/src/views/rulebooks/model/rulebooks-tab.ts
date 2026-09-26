export const RULEBOOKS_TAB = { list: "list", requests: "requests", sellers: "sellers" } as const;
export type RulebooksTab = (typeof RULEBOOKS_TAB)[keyof typeof RULEBOOKS_TAB];
