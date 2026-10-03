import type { GameStatus } from "@roll-and-call/database/games/model";

export const gameStatusColor: Record<GameStatus, "primary" | "gray" | "success" | "danger"> = {
  recruiting: "primary",
  closed: "gray",
  confirmed: "success",
  full: "gray",
  scheduled: "gray",
  cancelled: "danger",
};
