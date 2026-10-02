import { getSessionAccount } from "@/shared/server";
import { DeniedView } from "@/views/denied";

// 다른 서버의 화면·조치에 들어오면 403과 함께 권한 없음 화면을 보여 준다.
export default async function Forbidden() {
  const account = await getSessionAccount();
  return (
    <DeniedView
      nickname={account?.nickname ?? ""}
      userAppUrl={process.env.NEXT_PUBLIC_USER_APP_URL ?? "/"}
    />
  );
}
