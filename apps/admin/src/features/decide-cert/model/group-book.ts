import type { CertStatus } from "@/shared/server";

export interface GroupBook {
  applicationId: string;
  label: string;
  status: CertStatus;
  href: string;
}
