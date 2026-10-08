import type { ForumTagMap } from "@roll-and-call/database";

import type { ForumTagForm } from "./forum-tag-form";

// 연결하지 않은 칸을 빼고, 아무것도 없으면 null이다.
export function toForumTagMap(form: ForumTagForm): ForumTagMap | null {
  const categories = Object.fromEntries(Object.entries(form.categories).filter(([, id]) => id));
  const playTypes = {
    ...(form.playTypes.voice ? { voice: form.playTypes.voice } : {}),
    ...(form.playTypes.text ? { text: form.playTypes.text } : {}),
  };
  const map: ForumTagMap = {
    ...(form.open ? { open: form.open } : {}),
    ...(form.closed ? { closed: form.closed } : {}),
    ...(form.cancelled ? { cancelled: form.cancelled } : {}),
    ...(Object.keys(categories).length > 0 ? { categories } : {}),
    ...(Object.keys(playTypes).length > 0 ? { playTypes } : {}),
    ...(form.briefing ? { briefing: form.briefing } : {}),
  };
  return Object.keys(map).length > 0 ? map : null;
}
