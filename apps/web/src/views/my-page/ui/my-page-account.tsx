import { Text, VStack } from "@roll-and-call/ui";

import { AccentScope, ProfileLinks, profileDisplay } from "@/entities/profile";
import { getCurrentSessionUser } from "@/shared/server";

import { loadMyProfile } from "../api/load-my-profile";
import { loadMyQuestClears } from "../api/load-my-quest-clears";
import { MyPageAvailability } from "./my-page-availability";
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

  if (part === "panel") {
    const links = profile?.links ?? [];
    return (
      <AccentScope accentColor={profile?.accentColor}>
        <VStack gap="225" className="rounded-700 border border-gray-200 bg-surface p-200">
          {links.length > 0 && (
            <VStack gap="100">
              <Text weight="bold" typography="body4" foreground="muted" render={<h2 />}>
                링크
              </Text>
              <ProfileLinks links={links} discordId={profile?.discordId} variant="circle" />
            </VStack>
          )}
          <MyPageAvailability availability={profile?.availability ?? []} />
          <hr className="border-gray-200" />
          {settings}
        </VStack>
      </AccentScope>
    );
  }
  return <div className="desktop:hidden">{settings}</div>;
}
