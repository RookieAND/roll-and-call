import { Text } from "@trpg/ui";

interface MemberBioProps {
  bio: string;
}

export function MemberBio({ bio }: MemberBioProps) {
  return (
    <Text truncate typography="body4" foreground="muted">
      {bio}
    </Text>
  );
}
