// 자작 룰을 누가 구인에 쓸 수 있는지. 운영진만 어드민에서 바꾸고, 사용자 웹에는 내려보내지 않는다.
export const HOMEBREW_RULE_SCOPE = {
  makerOnly: "maker_only",
  everyone: "everyone",
} as const;

export const HOMEBREW_RULE_SCOPES = [
  HOMEBREW_RULE_SCOPE.makerOnly,
  HOMEBREW_RULE_SCOPE.everyone,
] as const;

export type HomebrewRuleScope = (typeof HOMEBREW_RULE_SCOPES)[number];
