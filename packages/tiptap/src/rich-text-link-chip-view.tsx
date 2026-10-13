import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";

import { detectLinkProvider } from "./detect-link-provider";
import { LINK_PROVIDER_LABEL } from "./link-provider";
import { RichTextProviderIcon } from "./rich-text-provider-icon";

// 에디터 안의 칩. 주소 글자는 숨기고 서비스 이름만 보여 준다. 채널 이름은 저장할 때 가져오므로 여기서는 모른다.
export function RichTextLinkChipView({ node }: NodeViewProps) {
  const provider = detectLinkProvider(String(node.attrs.href));
  if (!provider) return null;

  return (
    <NodeViewWrapper as="span" className="rich-text-chip" contentEditable={false}>
      <RichTextProviderIcon provider={provider} />
      <span className="rich-text-chip-label">{LINK_PROVIDER_LABEL[provider]}</span>
    </NodeViewWrapper>
  );
}
