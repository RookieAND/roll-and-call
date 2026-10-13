import {
  ClipboardList,
  FileText,
  Hash,
  HardDrive,
  Link2,
  NotebookText,
  Presentation,
  type LucideIcon,
  Table2,
} from "lucide-react";

import { BRAND_LOGO_PATH } from "./brand-logo-paths";
import { LINK_PROVIDER, type LinkProvider } from "./link-provider";
import { RichTextBrandLogo } from "./rich-text-brand-logo";

const ICON_SIZE = 16;

const PROVIDER_ICON: Partial<Record<LinkProvider, LucideIcon>> = {
  [LINK_PROVIDER.discord]: Hash,
  [LINK_PROVIDER.sheets]: Table2,
  [LINK_PROVIDER.docs]: FileText,
  [LINK_PROVIDER.slides]: Presentation,
  [LINK_PROVIDER.forms]: ClipboardList,
  [LINK_PROVIDER.drive]: HardDrive,
  [LINK_PROVIDER.notion]: NotebookText,
};

interface RichTextProviderIconProps {
  provider: LinkProvider;
}

export function RichTextProviderIcon({ provider }: RichTextProviderIconProps) {
  const brandLogoPath = BRAND_LOGO_PATH[provider];
  if (brandLogoPath) return <RichTextBrandLogo path={brandLogoPath} size={ICON_SIZE} />;

  const Icon = PROVIDER_ICON[provider] ?? Link2;
  return <Icon aria-hidden size={ICON_SIZE} />;
}
