import { Suspense } from "react";

import { GAME_TAB, GAME_TAB_DEFAULT, hasGameFilters, type GamesFilter } from "@/shared/api";
import {
  getCurrentServer,
  getGamesCounts,
  getRecruitingGamesPage,
  listGameRuleOptions,
} from "@/shared/server";

import { filterParams } from "../lib/filter-params";
import { CrossTabHint } from "./cross-tab-hint";
import { GameList } from "./game-list";
import { GameListSkeleton } from "./game-list-skeleton";
import { GamesFilterPanel } from "./games-filter-panel";
import { GamesJoinCallout } from "./games-join-callout";
import { GamesLayout } from "./games-layout";
import { GamesToolbar } from "./games-toolbar";
import { PastGameListSkeleton } from "./past-game-list-skeleton";

interface GameBoardProps {
  page?: number;
  filter: GamesFilter;
}

// 검색 이동 중(검색 입력의 aria-busy)에는 툴바는 그대로 두고 목록 자리만 뼈대로 바꾼다.
export async function GameBoard({ page = 1, filter }: GameBoardProps) {
  const server = await getCurrentServer();
  const gamesPage = getRecruitingGamesPage({ serverId: server.id, page, filter });
  const tab = filter.tab ?? GAME_TAB_DEFAULT;
  const [counts, allCounts, ruleOptions] = await Promise.all([
    getGamesCounts({ serverId: server.id, q: filter.q, filter }),
    filter.q || hasGameFilters(filter)
      ? getGamesCounts({ serverId: server.id, q: undefined })
      : null,
    listGameRuleOptions({ serverId: server.id, tab, now: new Date() }),
  ]);
  const listSkeleton = tab === GAME_TAB.past ? <PastGameListSkeleton /> : <GameListSkeleton />;
  const key = JSON.stringify(filterParams({ ...filter, page }));

  return (
    <GamesLayout
      callout={<GamesJoinCallout page={page} filter={filter} />}
      toolbar={
        <GamesToolbar
          filter={filter}
          counts={counts}
          tabCounts={allCounts ?? counts}
          ruleOptions={ruleOptions}
        />
      }
      panel={<GamesFilterPanel filter={filter} ruleOptions={ruleOptions} />}
      list={
        <>
          <div className="hidden group-has-[input[aria-busy=true]]/games:contents">
            {listSkeleton}
          </div>
          <div className="contents group-has-[input[aria-busy=true]]/games:hidden">
            <Suspense key={key} fallback={listSkeleton}>
              <GameList promise={gamesPage} page={page} filter={filter} />
            </Suspense>
            <CrossTabHint
              filter={filter}
              otherCount={tab === GAME_TAB.past ? counts.live : counts.past}
            />
          </div>
        </>
      }
    />
  );
}
