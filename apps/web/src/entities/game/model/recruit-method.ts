import type { Game } from "@/shared/server";

// Mirrors the `recruit_method` pgEnum; `satisfies` fails to compile if the app drifts from it.
export const RECRUIT_METHODS = [
  "first_come",
  "lottery",
] as const satisfies readonly Game["recruitMethod"][];

export type RecruitMethod = (typeof RECRUIT_METHODS)[number];

export const RECRUIT_METHOD = {
  firstCome: "first_come",
  lottery: "lottery",
} as const satisfies Record<string, RecruitMethod>;
