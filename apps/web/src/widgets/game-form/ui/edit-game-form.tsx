"use client";

import { countConfirmed } from "@/entities/game";
import { updateGame } from "@/features/write-game";
import type { GameDetailData } from "@/shared/server";
import { GameForm } from "./game-form";

// 수정 폼은 앱바·하단 바까지 한 화면 셸을 소유한다(이탈 확인 때문에). 삭제는 상세 GM 메뉴 한 곳.
export function EditGameForm({ game }: { game: GameDetailData }) {
  return (
    <GameForm
      onSubmit={updateGame.bind(null, game.id)}
      defaultGame={game}
      submitLabel="수정 저장"
      successMessage="수정되었습니다"
      edit={{
        gameId: game.id,
        applicantCount: game.participants.length,
        confirmedCount: countConfirmed(game.participants),
      }}
    />
  );
}
