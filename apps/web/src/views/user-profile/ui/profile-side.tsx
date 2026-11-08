import type { MemberProfile } from "@roll-and-call/database/profiles";

import { ProfileLinks } from "@/entities/profile";
import { ProfileMemoBlock } from "@/features/profile-memo";

import { ProfileAvailability } from "./profile-availability";
import { ProfileBlockLabel } from "./profile-block-label";

interface ProfileSideProps {
  profile: MemberProfile;
  signedIn: boolean;
  memo: { body: string; updatedAt: Date } | null;
}

// 데스크톱(1100px 이상) 우측 패널이다. 모바일은 본문 흐름에 링크·가능 시간대·메모를 따로 둔다.
export function ProfileSide({ profile, signedIn, memo }: ProfileSideProps) {
  return (
    <>
      <section className="p-200">
        <ProfileBlockLabel label="링크" />
        <ProfileLinks links={profile.links} discordId={profile.discordId} />
      </section>

      <div className="px-200 pb-200">
        <ProfileAvailability profile={profile} />
      </div>

      {signedIn && (
        <ProfileMemoBlock targetId={profile.id} targetName={profile.username} memo={memo} />
      )}
    </>
  );
}
