import type { GameStatus } from "@roll-and-call/database/rules";

export const gameStatusColor: Record<GameStatus, "primary" | "gray" | "success"> = {
  recruiting: "primary",
  closed: "gray",
  confirmed: "success",
  full: "gray",
  scheduled: "gray",
};
