import type { Metadata } from "next";

import { NotificationsView } from "@/views/notifications";

export const metadata: Metadata = { title: "알림" };

// 탭은 ?tab=todo면 [할 일], 그 밖은 [알림]이다. 화면이 주소에서 읽으므로 여기서는 넘기지 않는다.
export default function Page() {
  return <NotificationsView />;
}
