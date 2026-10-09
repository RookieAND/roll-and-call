import type { Game } from "#/schema/games";

// recruit_method pgEnum과 같다. 어긋나면 satisfies가 컴파일을 막는다.
export const RECRUIT_METHODS = [
  "first_come",
  "lottery",
  "selection",
] as const satisfies readonly Game["recruitMethod"][];

export type RecruitMethod = (typeof RECRUIT_METHODS)[number];

export const RECRUIT_METHOD = {
  firstCome: "first_come",
  lottery: "lottery",
  selection: "selection",
} as const satisfies Record<string, RecruitMethod>;

export const RECRUIT_METHOD_LABEL = {
  first_come: "선착순",
  lottery: "추첨",
  selection: "선발",
} as const satisfies Record<RecruitMethod, string>;
