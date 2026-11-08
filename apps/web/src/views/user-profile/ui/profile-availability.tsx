import type { MemberProfile } from "@roll-and-call/database/profiles";

import { AvailabilityRows } from "@/entities/profile";

import { ProfileBlockLabel } from "./profile-block-label";

interface ProfileAvailabilityProps {
  profile: MemberProfile;
}

export function ProfileAvailability({ profile }: ProfileAvailabilityProps) {
  return (
    <section className="**:data-[slot=card]:bg-transparent">
      <ProfileBlockLabel label="가능 시간대" />
      <AvailabilityRows intervals={profile.availability} />
    </section>
  );
}
