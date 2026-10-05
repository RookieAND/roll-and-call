import { isString } from "es-toolkit";
import type { Metadata } from "next";

import { HelpListView } from "@/views/help";

export const metadata: Metadata = {
  title: "도움말",
  description: "참여하기부터 GM 운영, 알림 설정까지 Roll & Call 사용법을 모았습니다.",
};

export default async function Page({ searchParams }: PageProps<"/help">) {
  const { from } = await searchParams;
  return <HelpListView from={isString(from) ? from : null} />;
}
