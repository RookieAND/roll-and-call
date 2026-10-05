import { AppBar } from "@/shared/ui";
import { DexSkeleton } from "@/views/my-badges";

export default function Loading() {
  return (
    <>
      <AppBar back="/games" title="업적" />
      <DexSkeleton />
    </>
  );
}
