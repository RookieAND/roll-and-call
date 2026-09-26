import { Container } from "@roll-and-call/ui";

import { toMyRulebooks } from "@/entities/rulebook";
import { LoginRequired } from "@/features/auth";
import { getCurrentUser, getRulebookRecords } from "@/shared/server";
import { AppBar } from "@/shared/ui";
import { CreateGameForm } from "@/widgets/game-form";

import { loadPreviousRound } from "../api/load-previous-round";

interface CreateGameViewProps {
  rulebookId?: string;
  previousGameId?: string;
}

export async function CreateGameView({ rulebookId, previousGameId }: CreateGameViewProps) {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <>
        <AppBar back="/games" title="구인 등록" />
        <Container size="sm">
          <div className="py-300">
            <LoginRequired description="구인을 올리려면 로그인이 필요합니다. 로그인하면 이 화면으로 돌아옵니다." />
          </div>
        </Container>
      </>
    );
  }

  // 위저드가 단계별로 앱바·진행바를 바꾸므로 폼이 페이지 셸을 소유한다.
  const [records, previousRound] = await Promise.all([
    getRulebookRecords(user.id),
    previousGameId ? loadPreviousRound(previousGameId, user.id) : null,
  ]);
  return (
    <CreateGameForm
      rulebooks={toMyRulebooks(records)}
      initialRulebookId={rulebookId}
      defaultGame={previousRound?.template}
      defaultPreConfirmed={previousRound?.preConfirmed}
    />
  );
}
