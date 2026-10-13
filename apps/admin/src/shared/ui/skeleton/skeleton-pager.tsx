import { Skeleton } from "@roll-and-call/ui";

const PAGE_BUTTONS = [0, 1, 2, 3, 4];

export function SkeletonPager() {
  return (
    <div className="grid shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-150 border-t border-(--rc-color-border-subtle) px-175 py-125">
      <Skeleton width={120} height={12} />
      <div className="flex items-center gap-050">
        {PAGE_BUTTONS.map((index) => (
          <Skeleton key={index} width={32} height={32} rounded={300} />
        ))}
      </div>
      <div className="flex justify-end">
        <Skeleton width={104} height={32} rounded={300} />
      </div>
    </div>
  );
}
