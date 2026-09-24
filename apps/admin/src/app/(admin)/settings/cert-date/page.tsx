import type { Metadata } from "next";

import { getCertDateSettings } from "@/shared/server";
import { SettingsCertDateView } from "@/views/settings";

export const metadata: Metadata = { title: "설정 · 룰북 인증 적용일" };

export default async function SettingsCertDatePage() {
  return <SettingsCertDateView settings={await getCertDateSettings()} />;
}
