import { Container } from "@trpg/ui";

import { LoginRequired } from "@/features/auth";
import { getCurrentUser } from "@/shared/server";
import { AppBar } from "@/shared/ui";
import { CreateGameForm } from "@/widgets/game-form";

export async function CreateGameView() {
  const user = await getCurrentUser();
  if (!user) {
    return (
      <>
        <AppBar back="/games" title="구인 등록" />
        <Container size="sm">
          <div className="py-6">
            <LoginRequired description="구인을 올리려면 로그인이 필요합니다. 로그인하면 이 화면으로 돌아옵니다." />
          </div>
        </Container>
      </>
    );
  }

  // 위저드가 단계별로 앱바·진행바를 바꾸므로 폼이 페이지 셸을 소유한다.
  return <CreateGameForm />;
}
