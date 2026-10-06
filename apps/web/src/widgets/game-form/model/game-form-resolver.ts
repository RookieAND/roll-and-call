import { zodResolver } from "@hookform/resolvers/zod";
import { omit } from "es-toolkit";
import type { Resolver } from "react-hook-form";

import { RULE_GATE, ruleGate, ruleSetOf, type MyRulebooks } from "@/entities/rulebook";
import { gameFormSchema, type GameFormValues } from "@/features/write-game";

import { editMinPlayersErrors } from "./edit-min-players-errors";
import type { GameEditContext } from "./game-form-layout";

export const BLOCKED_RULE_MESSAGE = "이 룰은 인증을 받아야 구인을 열 수 있습니다.";

export function gameFormResolver({
  rulebooks,
  edit,
}: {
  rulebooks: MyRulebooks | undefined;
  edit: GameEditContext | undefined;
}): Resolver<GameFormValues> {
  const schema = zodResolver(gameFormSchema);
  return async (values, context, options) => {
    const result = await schema(values, context, options);
    const set = rulebooks && ruleSetOf({ myRulebooks: rulebooks, rulebookId: values.rulebookId });
    const blocked = set && ruleGate({ set, myRulebooks: rulebooks }).type === RULE_GATE.blocked;
    const editErrors = edit ? editMinPlayersErrors({ values, edit }) : {};
    if (!blocked && Object.keys(editErrors).length === 0) return result;
    return {
      values: {},
      errors: {
        ...(editErrors.maxPlayers ? omit(result.errors, ["minPlayers"]) : result.errors),
        ...editErrors,
        ...(blocked ? { rule: { type: "blocked", message: BLOCKED_RULE_MESSAGE } } : {}),
      },
    };
  };
}
