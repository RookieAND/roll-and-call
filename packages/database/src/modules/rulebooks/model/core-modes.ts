// 분류(카테고리)의 기본 룰북 조건. all은 같은 판본의 기본 룰북을 모두 열어야 하고,
// any는 같은 판본의 기본 룰북 가운데 한 권만 열면 된다(인세인 기본과 대형판처럼 서로를 대신하는 책).
export const CORE_MODES = ["all", "any"] as const;

export type CoreMode = (typeof CORE_MODES)[number];

export const CORE_MODE = { all: "all", any: "any" } as const satisfies Record<
  CoreMode,
  CoreMode
>;
