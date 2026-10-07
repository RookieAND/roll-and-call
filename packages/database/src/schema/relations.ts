import { relations } from "drizzle-orm";

import { drawResults, games, participants } from "./games";
import { profiles } from "./profiles";
import { rulebookCategories, rulebooks } from "./rulebooks";

export const profilesRelations = relations(profiles, ({ many }) => ({
  hostedGames: many(games),
  participations: many(participants),
}));

export const gamesRelations = relations(games, ({ one, many }) => ({
  gm: one(profiles, { fields: [games.gmId], references: [profiles.id] }),
  rulebook: one(rulebooks, { fields: [games.rulebookId], references: [rulebooks.id] }),
  participants: many(participants),
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

export const rulebooksRelations = relations(rulebooks, ({ one }) => ({
  category: one(rulebookCategories, {
    fields: [rulebooks.categoryId],
    references: [rulebookCategories.id],
  }),
}));
