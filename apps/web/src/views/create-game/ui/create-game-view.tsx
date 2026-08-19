import { redirect } from "next/navigation";
import { CreateGameForm } from "@/widgets/game-form";
import { getCurrentUser } from "@/shared/api/supabase/server";

export async function CreateGameView() {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  // 위저드는 단계별로 앱바·진행바를 바꾸므로 CreateGameForm이 페이지 셸을 소유한다.
  return <CreateGameForm />;
}
