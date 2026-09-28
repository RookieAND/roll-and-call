import type { ReportReason } from "@/entities/review";

export type ReportInput = { reviewId: string; reason: ReportReason; detail: string };
