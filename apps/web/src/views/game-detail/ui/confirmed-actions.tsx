import { ConfirmedSessionNotice } from "@/entities/game";

export function ConfirmedActions({ confirmedAt }: { confirmedAt: Date }) {
  return <ConfirmedSessionNotice confirmedAt={confirmedAt} />;
}
