interface SparkleStarProps {
  size: number;
  className?: string;
}

export function SparkleStar({ size, className }: SparkleStarProps) {
  return (
    <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path
        fill="currentColor"
        d="M12 0c.6 6.2 5.8 11.4 12 12-6.2.6-11.4 5.8-12 12-.6-6.2-5.8-11.4-12-12C6.2 11.4 11.4 6.2 12 0Z"
      />
    </svg>
  );
}
