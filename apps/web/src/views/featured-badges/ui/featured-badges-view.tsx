import { VStack } from "@roll-and-call/ui";

import { featuredOptions, heldBadges, monthLabel, resolveFeaturedEntry } from "@/entities/badge";
import { profileDisplay } from "@/entities/profile";
import { LoginRequired } from "@/features/auth";
import { FeaturedBadgePicker } from "@/features/pick-featured-badges";
import {
  getCurrentSessionUser,
  getProfile,
  getUserBadges,
  getCurrentServer,
} from "@/shared/server";
import { AppBar, EmptyState } from "@/shared/ui";

export async function FeaturedBadgesView() {
  const user = await getCurrentSessionUser();
  if (!user) {
    return (
      <>
        <AppBar back="/me/badges" title="대표 뱃지" />
        <VStack className="py-300">
          <LoginRequired />
        </VStack>
      </>
    );
  }

  const server = await getCurrentServer();
  const [profile, records] = await Promise.all([
    getProfile(server.id, user.id),
    getUserBadges(server.id, user.id),
  ]);
  const { name, avatar } = profileDisplay({ profile, user });
  const held = heldBadges(records);
  const choices = featuredOptions(held).map(({ entry, badge }) => ({
    key: entry,
    emoji: badge.emoji,
    name: badge.name,
    look: badge.look,
    tag: badge.monthKey ? monthLabel(badge.monthKey) : null,
  }));
  const initialKeys = (profile?.featuredBadges ?? []).filter((entry) =>
    resolveFeaturedEntry(entry, held),
  );

  return (
    <>
      <AppBar back="/me/badges" title="대표 뱃지" />
      {choices.length > 0 ? (
        <FeaturedBadgePicker
          choices={choices}
          initialKeys={initialKeys}
          name={name}
          avatarUrl={avatar}
        />
      ) : (
        <VStack className="py-300">
          <EmptyState
            title="아직 받은 뱃지가 없습니다"
            description="첫 세션을 마치면 뱃지를 받습니다."
          />
        </VStack>
      )}
    </>
  );
}
