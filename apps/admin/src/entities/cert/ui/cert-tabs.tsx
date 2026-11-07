import "server-only";
import { getCertTabCounts } from "../api/get-cert-tab-counts";
import { CertRouteTabs } from "./cert-route-tabs";

interface CertTabsProps {
  value: string;
}

export async function CertTabs({ value }: CertTabsProps) {
  return <CertRouteTabs value={value} counts={await getCertTabCounts()} />;
}
