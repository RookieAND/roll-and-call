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
import { LINK_PROVIDER, LINK_PROVIDER_LABEL, type LinkProvider } from "./link-provider";
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

interface RichTextLinkChipProps {
  href: string;
  provider: LinkProvider;
  // 저장 때 가져온 이름(디스코드 채널명 등). 없으면 서비스 이름만 보여 준다.
  label?: string;
}

export function RichTextLinkChip({ href, provider, label }: RichTextLinkChipProps) {
  const brandLogoPath = BRAND_LOGO_PATH[provider];
  const Icon = PROVIDER_ICON[provider] ?? Link2;
  const isNamed = Boolean(label);

  return (
    <a
      className="rich-text-chip"
      data-named={isNamed}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {brandLogoPath ? (
        <RichTextBrandLogo path={brandLogoPath} size={ICON_SIZE} />
      ) : (
        <Icon aria-hidden size={ICON_SIZE} />
      )}
      <span className="rich-text-chip-label">{label || LINK_PROVIDER_LABEL[provider]}</span>
    </a>
  );
}
