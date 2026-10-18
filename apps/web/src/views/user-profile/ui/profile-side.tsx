import type { MemberProfile } from "@roll-and-call/database/profiles";

import { AvailabilityRows, ProfileLinks } from "@/entities/profile";
import { ProfileMemoBlock } from "@/features/profile-memo";

import { ProfileBlockLabel } from "./profile-block-label";

interface ProfileSideProps {
  profile: MemberProfile;
  signedIn: boolean;
  memo: { body: string; updatedAt: Date } | null;
}

// 링크·가능 시간대·메모: 모바일은 본문 맨 아래, 1100px 이상은 우측 패널에 그린다.
export function ProfileSide({ profile, signedIn, memo }: ProfileSideProps) {
  return (
    <>
      <section className="p-200">
        <ProfileBlockLabel label="링크" />
        <ProfileLinks links={profile.links} discordId={profile.discordId} />
      </section>

      <section className="px-200 pb-200">
        <ProfileBlockLabel label="가능 시간대" />
        <AvailabilityRows intervals={profile.availability} />
      </section>

      {signedIn && (
        <ProfileMemoBlock targetId={profile.id} targetName={profile.username} memo={memo} />
      )}
    </>
  );
}
