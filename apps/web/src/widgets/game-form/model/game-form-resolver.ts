import { zodResolver } from "@hookform/resolvers/zod";
import type { Resolver } from "react-hook-form";

import { RULE_GATE, ruleGate, ruleSetOf, type MyRulebooks } from "@/entities/rulebook";
import { gameFormSchema, type GameFormValues } from "@/features/write-game";

export const BLOCKED_RULE_MESSAGE = "이 룰은 인증을 받아야 구인을 열 수 있습니다.";

// 스키마 검사 위에 룰 인증 검사를 얹는다. 등록 화면(rulebooks가 있을 때)만 막는다.
export function gameFormResolver(rulebooks: MyRulebooks | undefined): Resolver<GameFormValues> {
  const schema = zodResolver(gameFormSchema);
  return async (values, context, options) => {
    const result = await schema(values, context, options);
    const set = rulebooks && ruleSetOf(rulebooks, values.rulebookId);
    if (!set || ruleGate(set, rulebooks).type !== RULE_GATE.blocked) return result;
    return {
      values: {},
      errors: { ...result.errors, rule: { type: "blocked", message: BLOCKED_RULE_MESSAGE } },
    };
  };
}
