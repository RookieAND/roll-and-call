import {
  BookMarked,
  ClipboardList,
  FileText,
  Hash,
  HardDrive,
  NotebookText,
  PenLine,
  Presentation,
  Table2,
} from "lucide-react";

import { LINK_PROVIDER, LINK_PROVIDER_LABEL, type LinkProvider } from "./link-provider";

const PROVIDER_ICON = {
  [LINK_PROVIDER.discord]: Hash,
  [LINK_PROVIDER.sheets]: Table2,
  [LINK_PROVIDER.docs]: FileText,
  [LINK_PROVIDER.slides]: Presentation,
  [LINK_PROVIDER.forms]: ClipboardList,
  [LINK_PROVIDER.drive]: HardDrive,
  [LINK_PROVIDER.notion]: NotebookText,
  [LINK_PROVIDER.postype]: PenLine,
  [LINK_PROVIDER.trpgDiary]: BookMarked,
} as const;

interface RichTextLinkChipProps {
  href: string;
  provider: LinkProvider;
  // 저장 때 가져온 이름(디스코드 채널명 등). 없으면 서비스 이름만 보여 준다.
  label?: string;
}

export function RichTextLinkChip({ href, provider, label }: RichTextLinkChipProps) {
  const Icon = PROVIDER_ICON[provider];
  const isNamed = Boolean(label);

  return (
    <a
      className="rich-text-chip"
      data-named={isNamed}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <Icon aria-hidden size={14} />
      <span className="rich-text-chip-label">{label || LINK_PROVIDER_LABEL[provider]}</span>
    </a>
  );
}
