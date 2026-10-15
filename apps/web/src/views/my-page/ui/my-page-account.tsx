import { profileDisplay } from "@/entities/profile";
import { getCurrentSessionUser } from "@/shared/server";

import { loadMyProfile } from "../api/load-my-profile";
import { loadMyQuestClears } from "../api/load-my-quest-clears";
import { MyPageLinks } from "./my-page-links";
import { MyPageSettings } from "./my-page-settings";

interface MyPageAccountProps {
  // 설정 줄: 모바일은 본문 맨 아래, 1100px 이상은 우측 패널에 그린다.
  part: "body" | "panel";
}

export async function MyPageAccount({ part }: MyPageAccountProps) {
  const user = (await getCurrentSessionUser())!;
  const [profile, cleared] = await Promise.all([
    loadMyProfile(user.id),
    loadMyQuestClears(user.id),
  ]);
  const { handle } = profileDisplay({ profile, user });
  const settings = (
    <MyPageSettings
      handleLabel={handle ? `@${handle}` : null}
      showBadges={profile?.showBadges ?? true}
      questProgress={cleared.length}
    />
  );

  if (part === "panel")
    return <div className="rounded-700 border border-gray-200 bg-surface p-200">{settings}</div>;
  return (
    <>
      <MyPageLinks links={profile?.links ?? []} discordId={profile?.discordId} />
      <div className="desktop:hidden">{settings}</div>
    </>
  );
}
