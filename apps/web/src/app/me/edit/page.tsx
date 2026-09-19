import type { Metadata } from "next";

import { EditProfileView } from "@/views/edit-profile";

export const metadata: Metadata = { title: "프로필 수정" };
export default function Page() {
  return <EditProfileView />;
}
