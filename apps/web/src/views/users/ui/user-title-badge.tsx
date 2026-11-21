import { BadgePill } from "@/entities/badge";

import type { UsersListItem } from "../model/users-list-item";

interface UserTitleBadgeProps {
  title: NonNullable<UsersListItem["title"]>;
  size: "xs" | "sm";
}

// 프로필의 대표 업적과 같은 등급별 알약을 쓴다.
export function UserTitleBadge({ title, size }: UserTitleBadgeProps) {
  return (
    <BadgePill
      emoji={title.emoji}
      name={title.name}
      look={title.look}
      tag={title.tag}
      size={size}
      className="max-w-36 shrink desktop:max-w-48"
    />
  );
}
