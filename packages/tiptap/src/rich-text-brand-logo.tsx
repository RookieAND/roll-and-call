interface RichTextBrandLogoProps {
  path: string;
  size: number;
}

export function RichTextBrandLogo({ path, size }: RichTextBrandLogoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d={path} />
    </svg>
  );
}
