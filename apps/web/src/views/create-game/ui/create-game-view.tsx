import { Container } from "@trpg/ui";
import { LoginRequired } from "@/features/auth";
import { CreateGameForm } from "@/widgets/game-form";
import { getCurrentUser } from "@/shared/server";
import { AppBar } from "@/shared/ui";
export async function CreateGameView() {
  const user = await getCurrentUser();
  // 조용히 튕기지 않는다. 로그인 후 이 화면으로 돌아와 이어서 등록한다.
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

  // 위저드는 단계별로 앱바·진행바를 바꾸므로 CreateGameForm이 페이지 셸을 소유한다.
  return <CreateGameForm />;
}
