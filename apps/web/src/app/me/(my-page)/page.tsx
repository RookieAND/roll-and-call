import type { Metadata } from "next";

import { MyPageView } from "@/views/my-page";

export const metadata: Metadata = { title: "마이페이지" };
export default function Page() {
  return <MyPageView />;
}
