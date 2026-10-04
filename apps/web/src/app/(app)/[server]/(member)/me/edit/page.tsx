import type { Metadata } from "next";

import { requireMembership } from "@/shared/server";
import { EditProfileView } from "@/views/edit-profile";

export const metadata: Metadata = { title: "프로필 수정" };
export default async function Page() {
  await requireMembership();
  return <EditProfileView />;
}
