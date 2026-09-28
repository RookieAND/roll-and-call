import { HStack } from "@roll-and-call/ui";

interface ReviewPhotosProps {
  urls: string[];
}

// ponytail: 크게 보기는 원본을 새 탭으로 연다. 사진 뷰어가 필요해지면 그때 시트로 바꾼다.
export function ReviewPhotos({ urls }: ReviewPhotosProps) {
  if (urls.length === 0) return null;
  return (
    <HStack gap="075" wrap>
      {urls.map((url, index) => (
        <a
          key={url}
          href={url}
          target="_blank"
          rel="noreferrer"
          className="size-14 overflow-hidden rounded-300 bg-gray-100"
        >
          <img src={url} alt={`후기 사진 ${index + 1}`} className="size-full object-cover" />
        </a>
      ))}
    </HStack>
  );
}
