import { profileDisplay } from "@/entities/profile";
import { CERT_STATE } from "@/entities/rulebook";
import { getCurrentSessionUser } from "@/shared/server";

import { loadMyProfile } from "../api/load-my-profile";
import { loadMyRulebooks } from "../api/load-my-rulebooks";
import { MyPageLinks } from "./my-page-links";
import { MyPageSettings } from "./my-page-settings";

export async function MyPageAccount() {
  const user = (await getCurrentSessionUser())!;
  const [profile, rulebooks] = await Promise.all([
    loadMyProfile(user.id),
    loadMyRulebooks(user.id),
  ]);
  const { handle } = profileDisplay({ profile, user });
  const canHost = rulebooks.rulebooks.some((rulebook) => rulebook.state === CERT_STATE.certified);
  const roleSetting = canHost ? { showGmBadge: profile?.showGmBadge ?? true } : null;

  return (
    <>
      <MyPageLinks links={profile?.links ?? []} />
      <MyPageSettings
        handleLabel={handle ? `@${handle}` : null}
        roleSetting={roleSetting}
        showBadges={profile?.showBadges ?? true}
      />
    </>
  );
}
