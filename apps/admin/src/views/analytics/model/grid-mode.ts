export const GRID_MODE = { finished: "finished", open: "open" } as const;
export type GridMode = (typeof GRID_MODE)[keyof typeof GRID_MODE];

export const GRID_MODE_LABEL = {
  [GRID_MODE.finished]: "진행된 세션",
  [GRID_MODE.open]: "모집 중",
} as const satisfies Record<GridMode, string>;
