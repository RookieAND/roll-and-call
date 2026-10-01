import { Container } from "@roll-and-call/ui";

import { LoginRequired } from "@/features/auth";
import { AvailabilityEditor } from "@/features/edit-availability";
import { getCurrentSessionUser, getProfile, getCurrentServer } from "@/shared/server";
import { AppBar } from "@/shared/ui";

export async function EditAvailabilityView() {
  const user = await getCurrentSessionUser();
  if (!user) {
    return (
      <>
        <AppBar back="/me" title="가능 시간대" />
        <Container size="sm">
          <div className="py-300">
            <LoginRequired />
          </div>
        </Container>
      </>
    );
  }

  const server = await getCurrentServer();
  const profile = await getProfile(server.id, user.id);

  return (
    <Container size="sm" className="px-0">
      <AvailabilityEditor defaultValue={profile?.availability ?? []} />
    </Container>
  );
}
