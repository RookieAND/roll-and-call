import type { MembershipStatus } from "@/shared/lib";

export interface UserRow {
  id: string;
  nickname: string;
  discordId: string;
  discordHandle: string;
  previousNicknames: string[];
  joinedAt: Date;
  isNew: boolean;
  hostedCount: number;
  playedCount: number;
  recentNoShowCount: number;
  certifiedCount: number;
  membership: MembershipStatus;
  sanctioned: boolean;
  sanctionUntil: Date | null;
}
