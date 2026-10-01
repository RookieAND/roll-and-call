import { relations } from "drizzle-orm";

import { availabilities, drawResults, games, participants } from "./games";
import { profiles } from "./profiles";

export const profilesRelations = relations(profiles, ({ many }) => ({
  hostedGames: many(games),
  participations: many(participants),
  availabilities: many(availabilities),
}));

export const gamesRelations = relations(games, ({ one, many }) => ({
  gm: one(profiles, { fields: [games.gmId], references: [profiles.id] }),
  participants: many(participants),
  availabilities: many(availabilities),
  drawResults: many(drawResults),
}));

export const drawResultsRelations = relations(drawResults, ({ one }) => ({
  game: one(games, { fields: [drawResults.gameId], references: [games.id] }),
  user: one(profiles, { fields: [drawResults.userId], references: [profiles.id] }),
}));

export const participantsRelations = relations(participants, ({ one }) => ({
  game: one(games, { fields: [participants.gameId], references: [games.id] }),
  user: one(profiles, {
    fields: [participants.userId],
    references: [profiles.id],
  }),
}));

export const availabilitiesRelations = relations(availabilities, ({ one }) => ({
  game: one(games, {
    fields: [availabilities.gameId],
    references: [games.id],
  }),
  user: one(profiles, {
    fields: [availabilities.userId],
    references: [profiles.id],
  }),
}));
