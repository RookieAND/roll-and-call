import { HStack, Text } from "@roll-and-call/ui";

import { LINK_MAX_COUNT, ProfileLinks, type ProfileLink } from "@/entities/profile";

interface MyPageLinksProps {
  links: ProfileLink[];
}

export function MyPageLinks({ links }: MyPageLinksProps) {
  return (
    <section>
      <HStack align="center" className="mb-125">
        <Text typography="heading3" render={<h2 />} className="flex-1">
          링크
        </Text>
        <Text numeric typography="body4" foreground="hint">
          {links.length} / {LINK_MAX_COUNT}
        </Text>
      </HStack>
      <ProfileLinks links={links} />
    </section>
  );
}
