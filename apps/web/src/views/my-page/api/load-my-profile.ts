import { cache } from "react";

import { getCurrentServer, getProfile } from "@/shared/server";

export const loadMyProfile = cache(async (userId: string) => {
  const server = await getCurrentServer();
  return getProfile(server.id, userId);
});
