import { SESSION_ROLE } from "@/entities/game";
import { profileDisplay } from "@/entities/profile";
import { CERT_STATE } from "@/entities/rulebook";
import { getCurrentSessionUser } from "@/shared/server";
import { sessionsHref } from "@/widgets/session-list";

import { loadMyPageSessions } from "../api/load-my-page-sessions";
import { loadMyProfile } from "../api/load-my-profile";
import { loadMyRulebooks } from "../api/load-my-rulebooks";
import { sessionTodos } from "../model/session-todos";
import { MyPageProfile } from "./my-page-profile";
import { MyPageTodos } from "./my-page-todos";

export async function MyPageSummary() {
  const user = (await getCurrentSessionUser())!;
  const [profile, mySessions, rulebooks] = await Promise.all([
    loadMyProfile(user.id),
    loadMyPageSessions(user.id),
    loadMyRulebooks(user.id),
  ]);
  const { name, avatar } = profileDisplay({ profile, user });
  const canHost = rulebooks.rulebooks.some((rulebook) => rulebook.state === CERT_STATE.certified);
  const showGmBadge = profile?.showGmBadge ?? true;
  const rejectedRulebooks = rulebooks.rulebooks.filter(
    (rulebook) => rulebook.state === CERT_STATE.rejected,
  );

  return (
    <>
      <MyPageProfile
        name={name}
        avatarUrl={avatar}
        isGm={canHost && showGmBadge}
        bio={profile?.bio ?? null}
        keywords={profile?.keywords ?? []}
        availability={profile?.availability ?? []}
        hosted={{
          count: mySessions[SESSION_ROLE.host].length,
          href: sessionsHref(SESSION_ROLE.host),
        }}
        played={{
          count: mySessions[SESSION_ROLE.player].length,
          href: sessionsHref(SESSION_ROLE.player),
        }}
      />
      <MyPageTodos todos={sessionTodos(mySessions)} rejectedRulebooks={rejectedRulebooks} />
    </>
  );
}
