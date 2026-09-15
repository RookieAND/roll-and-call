import { getCurrentUser } from "@/shared/server";

import { HomeDashboard } from "./home-dashboard";
import { HomeLanding } from "./home-landing";

export async function HomeView({ authError = false }: { authError?: boolean }) {
  const user = await getCurrentUser();
  return user ? <HomeDashboard user={user} /> : <HomeLanding authError={authError} />;
}
