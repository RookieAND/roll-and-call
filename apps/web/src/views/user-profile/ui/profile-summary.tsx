import { Text } from "@roll-and-call/ui";

import { EMPTY_BIO_TEXT, KeywordChips, ProfileRow } from "@/entities/profile";
import { toKst } from "@/shared/lib";
import type { Profile } from "@/shared/server";
import type { Absence } from "@/widgets/session-list";

import { ProfileAbsenceNotice } from "./profile-absence-notice";
import { ProfileBlockLabel } from "./profile-block-label";

interface ProfileSummaryProps {
  profile: Profile;
  absences: Absence[];
}

// 07 §C가 쓰는 bio·keywords·availability를 그대로 읽는다. 프로필을 위한 새 입력을 만들지 않는다.
export function ProfileSummary({ profile, absences }: ProfileSummaryProps) {
  const joinedLabel = toKst(profile.createdAt).format("YYYY년 M월부터");
  const bioText = profile.bio || EMPTY_BIO_TEXT;
  const bioForeground = profile.bio ? "normal" : "hint";

  return (
    <div className="px-200 pt-250 pb-050">
      {absences.length > 0 && (
        <div className="mb-200">
          <ProfileAbsenceNotice absences={absences} />
        </div>
      )}
      <ProfileRow
        size="xl"
        name={profile.username}
        avatarUrl={profile.avatarUrl}
        nameRender={<h1 />}
        subline={joinedLabel}
        sublineForeground="hint"
      />
      <Text
        typography="body2"
        foreground={bioForeground}
        render={<p />}
        className="mt-175 [text-wrap:pretty]"
      >
        {bioText}
      </Text>
      <div className="mt-175">
        <ProfileBlockLabel label="성향" />
        <KeywordChips keywords={profile.keywords} />
      </div>
    </div>
  );
}
