import { profileDisplay } from "@/entities/profile";
import { getCurrentServer, getCurrentSessionUser, getQuestClears } from "@/shared/server";

import { loadMyProfile } from "../api/load-my-profile";
import { MyPageLinks } from "./my-page-links";
import { MyPageSettings } from "./my-page-settings";

export async function MyPageAccount() {
  const user = (await getCurrentSessionUser())!;
  const server = await getCurrentServer();
  const [profile, cleared] = await Promise.all([
    loadMyProfile(user.id),
    getQuestClears({ serverId: server.id, userId: user.id }),
  ]);
  const { handle } = profileDisplay({ profile, user });

  return (
    <>
      <MyPageLinks links={profile?.links ?? []} discordId={profile?.discordId} />
      <MyPageSettings
        handleLabel={handle ? `@${handle}` : null}
        showBadges={profile?.showBadges ?? true}
        questProgress={cleared.length}
      />
    </>
  );
}
