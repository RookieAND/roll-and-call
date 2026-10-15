import { Container } from "@roll-and-call/ui";

import { LoginRequired } from "@/features/auth";
import { AvailabilityEditor } from "@/features/edit-availability";
import { getCurrentSessionUser, getProfile, getCurrentServer } from "@/shared/server";
import { AppBar, DESKTOP_CARD_CLASS, PageShell } from "@/shared/ui";

interface EditAvailabilityViewProps {
  from?: string;
}

export async function EditAvailabilityView({ from }: EditAvailabilityViewProps) {
  const user = await getCurrentSessionUser();
  if (!user) {
    return (
      <PageShell readable appBar={<AppBar back="/me" title="가능 시간대" />}>
        <div className={DESKTOP_CARD_CLASS}>
          <Container size="sm">
            <div className="py-300">
              <LoginRequired />
            </div>
          </Container>
        </div>
      </PageShell>
    );
  }

  const server = await getCurrentServer();
  const profile = await getProfile(server.id, user.id);

  return (
    <Container size="sm" className="px-0">
      <AvailabilityEditor defaultValue={profile?.availability ?? []} from={from} />
    </Container>
  );
}
