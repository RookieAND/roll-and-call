import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { getMemberOngoing, getUserDetail } from "@/entities/user/server";
import { serverPath } from "@/shared/lib";
import { getCurrentServer, requireStaff } from "@/shared/server";
import { UserSanctionMobileView, UserSanctionView } from "@/views/user-sanction";

export async function generateMetadata({
  params,
}: PageProps<"/[server]/users/[id]/sanction">): Promise<Metadata> {
  const user = await getUserDetail((await params).id);
  return { title: user ? `${user.nickname} 제재` : "제재" };
}

export default async function UserSanctionPage({
  params,
}: PageProps<"/[server]/users/[id]/sanction">) {
  const [{ id }, server] = await Promise.all([params, getCurrentServer(), requireStaff()]);
  const [user, ongoing] = await Promise.all([getUserDetail(id), getMemberOngoing(id)]);
  if (!user) notFound();
  if (user.sanction) redirect(serverPath({ slug: server.slug, path: `/users/${id}` }));
  const staffChannel = Boolean(server.staffChannelId);
  const now = new Date();
  return (
    <>
      <div data-view="desktop" className="contents max-lg:hidden">
        <UserSanctionView user={user} ongoing={ongoing} staffChannel={staffChannel} now={now} />
      </div>
      <div data-view="mobile" className="contents lg:hidden">
        <UserSanctionMobileView
          user={user}
          ongoing={ongoing}
          staffChannel={staffChannel}
          now={now}
        />
      </div>
    </>
  );
}
