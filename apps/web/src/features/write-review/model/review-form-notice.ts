import { formatDate } from "@/shared/lib";

type Notice = { palette: "primary" | "warning"; title: string; description: string };

export function reviewFormNotice({
  review,
  editUntil,
  gm = false,
}: {
  review: { hidden: boolean } | null;
  editUntil: Date;
  gm?: boolean;
}): Notice {
  if (!review) {
    return {
      palette: "primary",
      title: gm ? "이 세션의 마스터링 후기를 작성합니다" : "이 세션의 공개 후기를 작성합니다",
      description: `등록 후 ${formatDate(editUntil)}까지 수정할 수 있습니다.`,
    };
  }
  if (review.hidden) {
    return {
      palette: "warning",
      title: "운영진이 숨긴 후기입니다",
      description: "고친 뒤 디스코드로 해제를 요청해 주세요.",
    };
  }
  return {
    palette: "primary",
    title: "공개된 후기를 고칩니다",
    description: `${formatDate(editUntil)}까지 고칠 수 있습니다.`,
  };
}

export function reviewFormTitle({ editing, gm }: { editing: boolean; gm: boolean }): string {
  const noun = gm ? "마스터링 후기" : "후기";
  return `${noun} ${editing ? "고치기" : "쓰기"}`;
}
