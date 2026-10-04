import { redirect } from "next/navigation";

import { LoginButton } from "@/features/auth";
import { serverJoinPath } from "@/shared/lib";
import { getCurrentMembership, getCurrentServer, getCurrentSessionUser } from "@/shared/server";

import { JoinAuthErrorNotice } from "./join-auth-error-notice";
import { JoinLayout } from "./join-layout";
import { MemberJoinCheck } from "./member-join-check";

interface ServerJoinViewProps {
  next: string;
  authError: boolean;
}

export async function ServerJoinView({ next, authError }: ServerJoinViewProps) {
  const [server, user, membership] = await Promise.all([
    getCurrentServer(),
    getCurrentSessionUser(),
    getCurrentMembership(),
  ]);
  if (membership) redirect(next);

  const target = {
    slug: server.slug,
    name: server.name,
    icon: server.icon,
    inviteUrl: server.inviteUrl,
  };
  if (user) return <MemberJoinCheck target={target} next={next} />;

  return (
    <JoinLayout
      target={target}
      status="signedOut"
      notice={authError && <JoinAuthErrorNotice />}
      action={<LoginButton next={serverJoinPath({ slug: server.slug, next })} className="w-full" />}
    />
  );
}
