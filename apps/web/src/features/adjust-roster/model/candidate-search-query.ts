import { queryOptions } from "@tanstack/react-query";

import { searchCandidates } from "../api/search-candidates";
import { searchProfiles } from "../api/search-profiles";

// 게임이 있으면 그 게임의 명단 상태까지 붙여 찾고, 구인 등록처럼 게임이 없으면 사람만 찾는다.
export function candidateSearchQuery(gameId: string | undefined, keyword: string) {
  return queryOptions({
    queryKey: ["candidate-search", gameId ?? null, keyword] as const,
    queryFn: () => (gameId ? searchCandidates(gameId, keyword) : searchProfiles(keyword)),
  });
}
