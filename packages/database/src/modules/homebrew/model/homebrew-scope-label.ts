import { HOMEBREW_RULE_SCOPE, type HomebrewRuleScope } from "./homebrew-rule-scope";

export const HOMEBREW_SCOPE_LABEL = {
  [HOMEBREW_RULE_SCOPE.makerOnly]: "제작자만 사용",
  [HOMEBREW_RULE_SCOPE.everyone]: "전체 사용",
} as const satisfies Record<HomebrewRuleScope, string>;
