import type { Metadata } from "next";

import { MyRulebooksView } from "@/views/my-rulebooks";

export const metadata: Metadata = { title: "인증한 룰북" };
export default function Page() {
  return <MyRulebooksView />;
}
