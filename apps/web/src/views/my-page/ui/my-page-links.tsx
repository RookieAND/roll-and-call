import { Text } from "@trpg/ui";

import { LINK_MAX_COUNT, ProfileLinks, type ProfileLink } from "@/entities/profile";

// 매일 보는 것은 할 일과 세션이고 링크는 가끔 확인한다. 그래서 내 세션 아래 별도 섹션이다.
export function MyPageLinks({ links }: { links: ProfileLink[] }) {
  return (
    <section>
      <div className="mb-125 flex items-center">
        <Text typography="heading3" render={<h2 />} className="flex-1">
          링크
        </Text>
        <Text numeric typography="body4" foreground="hint">
          {links.length} / {LINK_MAX_COUNT}
        </Text>
      </div>
      <ProfileLinks links={links} />
    </section>
  );
}
