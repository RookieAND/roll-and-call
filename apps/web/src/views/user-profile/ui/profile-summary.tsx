import { Avatar, HStack, Text } from "@trpg/ui";

import { KeywordChips } from "@/entities/profile";
import { toKst } from "@/shared/lib";
import type { Profile } from "@/shared/server";

import { ProfileBlockLabel } from "./profile-block-label";

interface ProfileSummaryProps {
  profile: Profile;
}

// 07 §C가 쓰는 bio·keywords·availability를 그대로 읽는다. 프로필을 위한 새 입력을 만들지 않는다.
export function ProfileSummary({ profile }: ProfileSummaryProps) {
  const joinedLabel = toKst(profile.createdAt).format("YYYY년 M월부터");
  const bioText = profile.bio || "한 줄 소개가 없습니다.";
  const bioForeground = profile.bio ? undefined : "hint";
  const bioClass = profile.bio ? "mt-175 leading-[1.7] text-gray-700" : "mt-175 leading-[1.7]";

  return (
    <div className="px-200 pt-250 pb-050">
      <HStack align="center" gap="175">
        <Avatar
          src={profile.avatarUrl}
          name={profile.username}
          size="2xl"
          className="h-16 w-16 text-heading1"
        />
        <div className="min-w-0 flex-1">
          <Text typography="heading2" truncate render={<h1 />} className="tracking-[-0.02em]">
            {profile.username}
          </Text>
          <Text typography="body3" foreground="hint" className="mt-050 block">
            {joinedLabel}
          </Text>
        </div>
      </HStack>
      <Text typography="body2" foreground={bioForeground} render={<p />} className={bioClass}>
        {bioText}
      </Text>
      <div className="mt-175">
        <ProfileBlockLabel label="성향" />
        <KeywordChips keywords={profile.keywords} />
      </div>
    </div>
  );
}
