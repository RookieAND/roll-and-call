import { Container } from "@roll-and-call/ui";

import { toMyRulebooks } from "@/entities/rulebook";
import { LoginRequired } from "@/features/auth";
import {
  findActiveSanction,
  getCurrentServer,
  getCurrentSessionUser,
  getRulebookRecords,
} from "@/shared/server";
import { AppBar } from "@/shared/ui";
import { CreateGameForm } from "@/widgets/game-form";

import { loadReopen } from "../api/load-reopen";
import { CreateGameSanctioned } from "./create-game-sanctioned";

interface CreateGameViewProps {
  rulebookId?: string;
  // 지난 구인을 같은 내용으로 다시 열 때의 원본 구인 ID. 있으면 rulebookId보다 앞선다.
  fromGameId?: string;
}

export async function CreateGameView({ rulebookId, fromGameId }: CreateGameViewProps) {
  const user = await getCurrentSessionUser();
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
  const server = await getCurrentServer();
  const [sanction, records] = await Promise.all([
    findActiveSanction({ serverId: server.id, userId: user.id }),
    getRulebookRecords({ serverId: server.id, userId: user.id }),
  ]);
  if (sanction) return <CreateGameSanctioned reason={sanction.reason} until={sanction.until} />;
  const rulebooks = toMyRulebooks(records);
  const reopened = fromGameId
    ? await loadReopen({ serverId: server.id, userId: user.id, gameId: fromGameId, rulebooks })
    : null;
  return (
    <CreateGameForm
      serverId={server.id}
      rulebooks={rulebooks}
      initialRulebookId={reopened?.defaults ? undefined : rulebookId}
      defaultGame={reopened?.defaults}
      reopen={reopened?.reopen}
    />
  );
}
