import { isString } from "es-toolkit";
import type { Metadata } from "next";

import { OG_IMAGE } from "@/shared/lib";
import { HelpListView } from "@/views/help";

const title = "도움말";
const description = "참여하기부터 GM 운영, 알림 설정까지 Roll & Call 사용법을 모았습니다.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: { title, description, images: [OG_IMAGE] },
};

export default async function Page({ searchParams }: PageProps<"/help">) {
  const { from } = await searchParams;
  return <HelpListView from={isString(from) ? from : null} />;
}
