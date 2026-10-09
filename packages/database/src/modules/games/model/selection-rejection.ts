export const SELECTION_REJECTION = {
  notFound: "not_found",
  notGm: "not_gm",
  cancelled: "cancelled",
  notSelection: "not_selection",
  alreadyFinished: "already_finished",
  applicationClosed: "application_closed",
  noConfirmed: "no_confirmed",
  minPlayersUnmet: "min_players_unmet",
} as const;

export type SelectionRejection = (typeof SELECTION_REJECTION)[keyof typeof SELECTION_REJECTION];
