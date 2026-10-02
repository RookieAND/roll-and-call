import { redirect } from "next/navigation";

import { serverPath } from "@/shared/lib";
import { getCurrentServer } from "@/shared/server";

export default async function SettingsPage() {
  const server = await getCurrentServer();
  redirect(serverPath({ slug: server.slug, path: "/settings/server" }));
}
