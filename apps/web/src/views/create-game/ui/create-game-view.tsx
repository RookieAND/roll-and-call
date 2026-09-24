import { Container } from "@roll-and-call/ui";

import { toMyRulebooks } from "@/entities/rulebook";
import { LoginRequired } from "@/features/auth";
import { getCurrentUser, getRulebookRecords } from "@/shared/server";
import { AppBar } from "@/shared/ui";
import { CreateGameForm } from "@/widgets/game-form";

interface CreateGameViewProps {
  rulebookId?: string;
}

export async function CreateGameView({ rulebookId }: CreateGameViewProps) {
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
  const rulebooks = toMyRulebooks(await getRulebookRecords(user.id));
  return <CreateGameForm rulebooks={rulebooks} initialRulebookId={rulebookId} />;
}
