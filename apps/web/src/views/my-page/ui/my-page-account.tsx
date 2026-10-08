import { profileDisplay } from "@/entities/profile";
import { getCurrentSessionUser } from "@/shared/server";

import { loadMyProfile } from "../api/load-my-profile";
import { MyPageLinks } from "./my-page-links";
import { MyPageSettings } from "./my-page-settings";

export async function MyPageAccount() {
  const user = (await getCurrentSessionUser())!;
  const profile = await loadMyProfile(user.id);
  const { handle } = profileDisplay({ profile, user });

  return (
    <>
      <MyPageLinks links={profile?.links ?? []} discordId={profile?.discordId} />
      <MyPageSettings
        handleLabel={handle ? `@${handle}` : null}
        showBadges={profile?.showBadges ?? true}
      />
    </>
  );
}
