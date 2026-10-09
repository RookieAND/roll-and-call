import { loadNewGameSanction } from "../api/load-new-game-sanction";
import { GamesAppBarFrame } from "./games-app-bar-frame";

export async function GamesAppBar() {
  const sanction = await loadNewGameSanction();
  return <GamesAppBarFrame sanction={sanction} />;
}
