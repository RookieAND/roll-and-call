import {
  normalizeApplicationQuestion,
  PRIVATE_GAME_COLUMNS,
  type RecruitMethod,
} from "@roll-and-call/database/games/model";

import { GAME_VISIBILITY, RECRUIT_METHOD, type GameVisibility } from "@/entities/game";

import type { SplitTeamsRecruitInput } from "./split-teams-input";
import { SPLIT_TEAMS_MESSAGE } from "./split-teams-rules";

export interface SplitTeamsRecruitColumns {
  recruitMethod: RecruitMethod;
  minPlayers: number | null;
  applicationNoteEnabled: boolean;
  applicationQuestion: string | null;
  waitlistEnabled: boolean;
}

// 새 구인의 모집 방식 칼럼. 지정 모집은 선착순이고 최소 인원·신청글·대기 접수를 쓰지 않는다.
// 일반 모집은 구인 등록과 같은 값이다. 선발은 신청글을 받아야 하고, 추첨·선발은 정원과 무관하게 받아 대기 접수를 켠다.
export function splitTeamsRecruit({
  visibility,
  recruit,
  maxPlayers,
}: {
  visibility: GameVisibility;
  recruit: SplitTeamsRecruitInput | undefined;
  maxPlayers: number;
}): { columns: SplitTeamsRecruitColumns } | { error: string } {
  if (visibility === GAME_VISIBILITY.private) return { columns: { ...PRIVATE_GAME_COLUMNS } };
  if (!recruit) return { error: SPLIT_TEAMS_MESSAGE.recruit };
  if (recruit.minPlayers !== null && recruit.minPlayers > maxPlayers) {
    return { error: SPLIT_TEAMS_MESSAGE.minPlayers };
  }
  const noteEnabled =
    recruit.applicationNoteEnabled || recruit.recruitMethod === RECRUIT_METHOD.selection;
  return {
    columns: {
      recruitMethod: recruit.recruitMethod,
      minPlayers: recruit.minPlayers,
      applicationNoteEnabled: noteEnabled,
      applicationQuestion: noteEnabled
        ? normalizeApplicationQuestion(recruit.applicationQuestion)
        : null,
      waitlistEnabled:
        recruit.recruitMethod === RECRUIT_METHOD.firstCome ? recruit.waitlistEnabled : true,
    },
  };
}
