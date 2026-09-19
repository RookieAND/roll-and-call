import type { MemberSummary } from "@/features/adjust-roster";

export type ManagedMember = MemberSummary & { joinedAt: Date };
