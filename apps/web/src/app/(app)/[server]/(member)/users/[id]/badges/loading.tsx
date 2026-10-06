import { AppBar } from "@/shared/ui";
import { UserBadgesSkeleton } from "@/views/user-badges";

export default function Loading() {
  return (
    <>
      <AppBar back="/games" title="업적" />
      <UserBadgesSkeleton />
    </>
  );
}
