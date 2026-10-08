import { ONBOARDING_QUEST } from "@roll-and-call/database/onboarding/model";
import { redirect } from "next/navigation";

import { serverPath } from "@/shared/lib";
import { getCurrentServer, getCurrentSessionUser, getQuestClears } from "@/shared/server";
import { TrialFirstRecruitView } from "@/views/trial-quest";

// 첫 모집은 룰북 인증 퀘스트를 깬 뒤에만 열린다(R19). 깨지 않았으면 퀘스트 목록으로 돌려보낸다.
export default async function FirstRecruitPage() {
  const [server, user] = await Promise.all([getCurrentServer(), getCurrentSessionUser()]);
  const cleared = user ? await getQuestClears({ serverId: server.id, userId: user.id }) : [];
  if (!cleared.includes(ONBOARDING_QUEST.rulebookCert)) {
    redirect(serverPath({ slug: server.slug, path: "/onboarding" }));
  }
  return <TrialFirstRecruitView />;
}
