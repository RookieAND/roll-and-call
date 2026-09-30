import { BADGE_ROLE } from "@roll-and-call/database/rules";
import { Container, Text, VStack } from "@roll-and-call/ui";
import { Lock } from "lucide-react";
import { notFound, redirect } from "next/navigation";

import { badgeRequirement, heldBadges } from "@/entities/badge";
import { heldBadgeDetail } from "@/features/view-badge";
import { toKst } from "@/shared/lib";
import { getCurrentSessionUser, getProfile, getUserBadges } from "@/shared/server";
import { AppBar, EmptyState } from "@/shared/ui";

import { UserBadgeGroup } from "./user-badge-group";

const GROUPS = [
  { role: BADGE_ROLE.player, title: "PL 참여" },
  { role: BADGE_ROLE.gm, title: "GM 운영" },
] as const;

interface UserBadgesViewProps {
  id: string;
}

// 남의 업적. 받은 뱃지만 분류별로 보이고, 본인이 업적 보이기를 끄면 잠긴 화면만 보인다.
export async function UserBadgesView({ id }: UserBadgesViewProps) {
  const [viewer, profile] = await Promise.all([getCurrentSessionUser(), getProfile(id)]);
  if (viewer?.id === id) redirect("/me/badges");
  if (!profile) notFound();

  const title = `${profile.username}의 업적`;
  const back = `/u/${id}`;
  if (!profile.showBadges) {
    return (
      <>
        <AppBar back={back} title={title} />
        <VStack align="center" gap="100" className="px-300 pt-500 pb-600 text-center">
          <span className="flex size-16 items-center justify-center rounded-full border-2 border-dashed border-gray-300 bg-canvas text-hint">
            <Lock size={24} aria-hidden />
          </span>
          <Text typography="subtitle1">업적을 공개하지 않았습니다</Text>
          <Text typography="body3" foreground="muted">
            프로필 주인이 업적을 숨겨 두었습니다.
          </Text>
        </VStack>
      </>
    );
  }

  const now = new Date();
  const records = await getUserBadges(id);
  const held = heldBadges(records, now);
  const groups = GROUPS.map((group) => ({
    ...group,
    rows: held
      .filter((badge) => badge.role === group.role)
      .map((badge) => ({
        key: badge.key,
        emoji: badge.emoji,
        grade: badge.grade,
        name: badge.name,
        requirement: badgeRequirement(badge.ladder, badge.step, badge.categoryName),
        dateLabel: toKst(badge.record.earnedAt).format("YY.MM.DD"),
        detail: heldBadgeDetail(badge, { records, facts: null, now }),
      })),
  })).filter((group) => group.rows.length > 0);

  return (
    <>
      <AppBar
        back={back}
        title={title}
        action={
          <Text typography="body3" foreground="hint" numeric className="pr-125">
            {held.length}개
          </Text>
        }
      />
      <Container size="sm" className="pb-250">
        {groups.length > 0 ? (
          groups.map((group) => (
            <UserBadgeGroup key={group.role} title={group.title} rows={group.rows} />
          ))
        ) : (
          <VStack className="py-300">
            <EmptyState title="아직 받은 뱃지가 없습니다" />
          </VStack>
        )}
      </Container>
    </>
  );
}
