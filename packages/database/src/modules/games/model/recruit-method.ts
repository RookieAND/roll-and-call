import type { Game } from "#/schema/games";

// recruit_method pgEnum과 같다. 어긋나면 satisfies가 컴파일을 막는다.
export const RECRUIT_METHODS = [
  "first_come",
  "lottery",
] as const satisfies readonly Game["recruitMethod"][];

export type RecruitMethod = (typeof RECRUIT_METHODS)[number];

export const RECRUIT_METHOD = {
  firstCome: "first_come",
  lottery: "lottery",
} as const satisfies Record<string, RecruitMethod>;
