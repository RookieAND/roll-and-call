import type { ForumTagMap } from "@roll-and-call/database";

import type { ForumTagForm } from "./forum-tag-form";

// 연결하지 않은 칸을 빼고, 아무것도 없으면 null이다.
export function toForumTagMap(form: ForumTagForm): ForumTagMap | null {
  const categories = Object.fromEntries(Object.entries(form.categories).filter(([, id]) => id));
  const map: ForumTagMap = {
    ...(form.open ? { open: form.open } : {}),
    ...(form.closed ? { closed: form.closed } : {}),
    ...(Object.keys(categories).length > 0 ? { categories } : {}),
  };
  return Object.keys(map).length > 0 ? map : null;
}
