import { GameTagBlock } from "./game-tag-block";

const AI_IMAGE_NOTE = "GM과 플레이어 모두에게 적용됩니다.";

export function AiImageBlock({ label }: { label: string }) {
  return <GameTagBlock label="AI 이미지" tags={[label]} note={AI_IMAGE_NOTE} />;
}
