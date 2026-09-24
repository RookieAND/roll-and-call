export const GRID_MODE = { finished: "finished", open: "open" } as const;
export type GridMode = (typeof GRID_MODE)[keyof typeof GRID_MODE];
