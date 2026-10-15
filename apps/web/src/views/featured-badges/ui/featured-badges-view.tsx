import { Button, VStack } from "@roll-and-call/ui";

import {
  badgeRequirementLine,
  featuredOptions,
  heldBadges,
  monthLabel,
  resolveFeaturedEntry,
} from "@/entities/badge";
import { LoginRequired } from "@/features/auth";
import { FeaturedBadgePicker } from "@/features/pick-featured-badges";
import {
  getCurrentSessionUser,
  getProfile,
  getUserBadges,
  getCurrentServer,
} from "@/shared/server";
import { AppBar, DESKTOP_CARD_CLASS, EmptyState, PageShell, ServerLink } from "@/shared/ui";

export async function FeaturedBadgesView() {
  const user = await getCurrentSessionUser();
  if (!user) {
    return (
      <PageShell readable appBar={<AppBar back="/me/badges" title="대표 뱃지 설정" />}>
        <VStack className={`py-300 ${DESKTOP_CARD_CLASS}`}>
          <LoginRequired />
        </VStack>
      </PageShell>
    );
  }

  const server = await getCurrentServer();
  const [profile, records] = await Promise.all([
    getProfile(server.id, user.id),
    getUserBadges(server.id, user.id),
  ]);
  const held = heldBadges(records);
  const choices = featuredOptions(held).map(({ entry, badge }) => ({
    key: entry,
    emoji: badge.emoji,
    name: badge.name,
    look: badge.look,
    tag: badge.monthKey ? monthLabel(badge.monthKey) : null,
    role: badge.role,
    ladder: badge.ladder,
    requirement: badgeRequirementLine({
      ladder: badge.ladder,
      step: badge.step,
      categoryName: badge.categoryName,
    }),
  }));
  const initialKeys = (profile?.featuredBadges ?? []).filter((entry) =>
    resolveFeaturedEntry(entry, held),
  );

  return (
    <PageShell readable flush appBar={<AppBar back="/me/badges" title="대표 뱃지 설정" />}>
      <div className={DESKTOP_CARD_CLASS}>
        {choices.length > 0 ? (
          <FeaturedBadgePicker choices={choices} initialKeys={initialKeys} />
        ) : (
          <VStack className="py-300">
            <EmptyState
              size="section"
              image="empty-achievement"
              title="아직 받은 뱃지가 없습니다"
              description="첫 세션을 마치면 뱃지를 받습니다."
              action={
                <Button
                  render={<ServerLink path="/me/badges" />}
                  variant="outline"
                  className="mt-100"
                >
                  뱃지 목록 보기
                </Button>
              }
            />
          </VStack>
        )}
      </div>
    </PageShell>
  );
}
