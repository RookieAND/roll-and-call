import type { db } from "@/shared/server";

export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];
