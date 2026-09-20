import { Text } from "@trpg/ui";

export function MemberBio({ bio }: { bio: string }) {
  return (
    <Text truncate typography="body4" foreground="muted">
      {bio}
    </Text>
  );
}
