import { Text, VStack } from "@roll-and-call/ui";

import { HomebrewImageGrid } from "./homebrew-image-grid";
import { MaterialLinkRow } from "./material-link-row";

interface ReviewMaterialProps {
  // 신청자가 적은 룰북 설명. 설명 칸이 생기기 전에 낸 신청은 비어 있다.
  description: string;
  links: string[];
  images: { key: string; url: string | null }[];
  ruleName: string;
}

export function ReviewMaterial({ description, links, images, ruleName }: ReviewMaterialProps) {
  return (
    <VStack gap="200">
      {description ? (
        <VStack gap="100">
          <Text typography="body4" weight="bold" foreground="muted">
            룰북 설명
          </Text>
          <Text typography="body3" render={<p />} className="break-keep whitespace-pre-wrap">
            {description}
          </Text>
        </VStack>
      ) : null}
      {links.length > 0 ? (
        <VStack gap="100">
          <Text typography="body4" weight="bold" foreground="muted">
            링크
          </Text>
          {links.map((url) => (
            <MaterialLinkRow key={url} url={url} />
          ))}
          <Text typography="body4" foreground="hint">
            열리지 않으면 「자료를 열 수 없음」으로 반려해 주세요.
          </Text>
        </VStack>
      ) : null}
      {images.length > 0 ? (
        <VStack gap="100">
          <Text typography="body4" weight="bold" foreground="muted">
            이미지
          </Text>
          <HomebrewImageGrid images={images} ruleName={ruleName} />
        </VStack>
      ) : null}
    </VStack>
  );
}
