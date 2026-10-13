import { LINK_PROVIDER_LABEL, type LinkProvider } from "./link-provider";
import { RichTextProviderIcon } from "./rich-text-provider-icon";

interface RichTextLinkChipProps {
  href: string;
  provider: LinkProvider;
  // 저장 때 가져온 이름(디스코드 채널명 등). 없으면 서비스 이름만 보여 준다.
  label?: string;
}

export function RichTextLinkChip({ href, provider, label }: RichTextLinkChipProps) {
  const isNamed = Boolean(label);

  return (
    <a
      className="rich-text-chip"
      data-named={isNamed}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      <RichTextProviderIcon provider={provider} />
      <span className="rich-text-chip-label">{label || LINK_PROVIDER_LABEL[provider]}</span>
    </a>
  );
}
