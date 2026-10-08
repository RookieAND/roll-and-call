import { GameTagBlock } from "./game-tag-block";

const AI_IMAGE_NOTE_LINES = ["GM과 플레이어 모두에게 적용됩니다."] as const;

interface AiImageBlockProps {
  label: string;
}

export function AiImageBlock({ label }: AiImageBlockProps) {
  return <GameTagBlock label="AI 이미지" tags={[label]} noteLines={AI_IMAGE_NOTE_LINES} />;
}
