"use client";

import { useRepresentativeTitle } from "../model/use-representative-title";
import { BadgePill } from "./badge-pill";

interface MemberTitleProps {
  userId: string;
}

export function MemberTitle({ userId }: MemberTitleProps) {
  const title = useRepresentativeTitle(userId);
  if (!title) return null;
  return <BadgePill size="xs" emoji={title.emoji} name={title.name} look={title.look} />;
}
