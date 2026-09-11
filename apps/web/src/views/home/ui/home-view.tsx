import { getCurrentUser } from "@/shared/server";
import { HomeDashboard } from "./home-dashboard";
import { HomeLanding } from "./home-landing";

// 같은 "/" 라우트가 로그인 여부에 따라 완전히 다른 화면을 그린다. 여기선 분기만 한다.
export async function HomeView() {
  const user = await getCurrentUser();
  return user ? <HomeDashboard user={user} /> : <HomeLanding />;
}
