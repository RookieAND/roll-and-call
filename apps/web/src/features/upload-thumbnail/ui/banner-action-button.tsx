import type { LucideIcon } from "lucide-react";

interface BannerActionButtonProps {
  icon: LucideIcon;
  label: string;
  disabled?: boolean;
  onClick: () => void;
}

// 배너 미리보기 위에 얹는 동그란 아이콘 버튼. 배너 이미지가 밝아도 보이도록 어두운 바탕을 깐다.
export function BannerActionButton({
  icon: Icon,
  label,
  disabled,
  onClick,
}: BannerActionButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="flex size-11 items-center justify-center rounded-full bg-black/60 text-white transition-opacity hover:bg-black/70 focus-visible:ring-2 focus-visible:ring-focus focus-visible:outline-none disabled:opacity-40"
    >
      <Icon size={20} aria-hidden />
    </button>
  );
}
