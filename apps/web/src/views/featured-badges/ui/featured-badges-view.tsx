import { VStack } from "@roll-and-call/ui";

import { heldBadges, monthLabel } from "@/entities/badge";
import { profileDisplay } from "@/entities/profile";
import { LoginRequired } from "@/features/auth";
import { FeaturedBadgePicker } from "@/features/pick-featured-badges";
import { getCurrentSessionUser, getProfile, getUserBadges } from "@/shared/server";
import { AppBar, EmptyState } from "@/shared/ui";

// 대표 뱃지 고르기. 지금 달고 있는 뱃지만 후보로 낸다.
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

  const [profile, records] = await Promise.all([getProfile(user.id), getUserBadges(user.id)]);
  const { name, avatar } = profileDisplay({ profile, user });
  const choices = heldBadges(records).map((badge) => ({
    key: badge.key,
    emoji: badge.emoji,
    name: badge.name,
    grade: badge.grade,
    tag: badge.monthKey ? monthLabel(badge.monthKey) : null,
  }));
  const heldKeys = new Set(choices.map((choice) => choice.key));
  const initialKeys = (profile?.featuredBadges ?? []).filter((key) => heldKeys.has(key));

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
