import { games, rulebookCategories } from "../../../schema";

export const sessionColumns = {
  gameId: games.id,
  title: games.title,
  confirmedAt: games.confirmedAt,
  playMinutes: games.playMinutes,
  attendanceConfirmedAt: games.attendanceConfirmedAt,
  hiddenAt: games.hiddenAt,
  categoryId: rulebookCategories.id,
  categoryName: rulebookCategories.name,
};
