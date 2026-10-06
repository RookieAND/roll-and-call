import { BADGE_TAB, type BadgeTab } from "@/entities/badge";
import { EmptyState } from "@/shared/ui";

const EMPTY_COPY: Record<BadgeTab, { image: string; title: string; description: string }> = {
  [BADGE_TAB.gm]: {
    image: "/empty-states/empty-hosted.png",
    title: "아직 받은 GM 뱃지가 없습니다",
    description: "세션을 진행하면 GM 뱃지를 받습니다.",
  },
  [BADGE_TAB.player]: {
    image: "/empty-states/empty-party.png",
    title: "아직 받은 PL 뱃지가 없습니다",
    description: "세션에 참여하면 PL 뱃지를 받습니다.",
  },
  [BADGE_TAB.special]: {
    image: "/empty-states/empty-my-games.png",
    title: "아직 받은 특별 업적이 없습니다",
    description: "특별한 활동을 하면 받는 업적입니다.",
  },
};

interface UserBadgesEmptyProps {
  tab: BadgeTab;
}

export function UserBadgesEmpty({ tab }: UserBadgesEmptyProps) {
  return <EmptyState size="section" {...EMPTY_COPY[tab]} />;
}
