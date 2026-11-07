import type { MemberProfile } from "@roll-and-call/database/profiles";
import { Avatar, Card, HStack, Text, VStack } from "@roll-and-call/ui";

import { formatInterval } from "@/entities/profile";
import { filledDays, toKst } from "@/shared/lib";

interface UserSessionsProfilePanelProps {
  profile: MemberProfile;
}

export function UserSessionsProfilePanel({ profile }: UserSessionsProfilePanelProps) {
  const days = filledDays(profile.availability);

  return (
    <>
      <Card.Root>
        <HStack align="center" gap="150">
          <Avatar src={profile.avatarUrl} name={profile.username} size="xl" />
          <VStack gap="025" className="min-w-0">
            <Text typography="heading3" truncate render={<h2 />}>
              {profile.username}
            </Text>
            <Text typography="body4" foreground="hint">
              {toKst(profile.joinedAt).format("YYYY년 M월부터")}
            </Text>
          </VStack>
        </HStack>
        {profile.bio && (
          <Text typography="body3" foreground="muted" render={<p />} className="mt-150 text-pretty">
            {profile.bio}
          </Text>
        )}
      </Card.Root>
      {days.length > 0 && (
        <Card.Root>
          <Text typography="subtitle1" render={<h2 />}>
            가능 시간대
          </Text>
          <VStack render={<dl />} className="mt-100">
            {days.map((day) => (
              <HStack
                key={day.day}
                justify="between"
                gap="100"
                className="border-gray-200 py-100 not-first:border-t"
              >
                <Text typography="body4" foreground="muted" render={<dt />}>
                  {day.label}
                </Text>
                <Text typography="body4" numeric render={<dd />}>
                  {day.intervals.map(formatInterval).join(" · ")}
                </Text>
              </HStack>
            ))}
          </VStack>
        </Card.Root>
      )}
    </>
  );
}
