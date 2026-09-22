import { Text } from "@trpg/ui";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface DrawResultLinkProps {
  gameId: string;
}

export function DrawResultLink({ gameId }: DrawResultLinkProps) {
  return (
    <Text
      typography="body4"
      weight="bold"
      foreground="primary"
      render={<Link href={`/games/${gameId}/draw`} className="inline-flex items-center gap-025" />}
    >
      추첨 결과
      <ChevronRight size={13} strokeWidth={2.4} aria-hidden />
    </Text>
  );
}
