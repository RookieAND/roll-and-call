import "server-only";
import { revalidatePath } from "next/cache";
import { after } from "next/server";

import { serverPath } from "@/shared/lib";
import {
  announceRecruitmentComplete,
  grantRushBadge,
  refreshRecruitPost,
  seedAvailabilityFromProfile,
  type Server,
} from "@/shared/server";

import { announceNewApplication } from "./announce-new-application";
import { type Application } from "./apply-to-game";

// 신청이 커밋된 뒤 할 일. 웹 버튼과 디스코드 버튼이 같이 쓴다.
export async function finishApplication({
  server,
  userId,
  application,
}: {
  server: Server;
  userId: string;
  application: Application;
}) {
  await seedAvailabilityFromProfile({ game: application.game, userId });
  after(async () => {
    await announceNewApplication({
      server,
      game: application.game,
      applicantId: userId,
      isWaiting: application.waiting,
      confirmedCount: application.confirmedCount,
    });
    if (application.becameFull) {
      await announceRecruitmentComplete({ server, gameId: application.game.id });
      await grantRushBadge({ serverId: server.id, gameId: application.game.id });
    }
    await refreshRecruitPost({ server, gameId: application.game.id });
  });

  const gamePath = serverPath({ slug: server.slug, path: `/games/${application.game.id}` });
  revalidatePath(gamePath);
  revalidatePath(`${gamePath}/participants`);
  revalidatePath(`${gamePath}/schedule`);
  revalidatePath(serverPath({ slug: server.slug, path: "/games" }));
}
