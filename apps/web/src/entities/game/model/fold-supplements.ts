// 서플리먼트가 이보다 많으면 앞의 몇 권만 보이고 나머지는 [N권 더 보기]로 펼친다. 한 권만 감추면 번거로워서 4권까지는 접지 않는다.
const FOLD_AFTER = 4;
const FOLDED_COUNT = 3;

export function foldSupplements<Item>({ items, expanded }: { items: Item[]; expanded: boolean }) {
  const foldable = items.length > FOLD_AFTER;
  return {
    visible: foldable && !expanded ? items.slice(0, FOLDED_COUNT) : items,
    foldable,
    hiddenCount: foldable ? items.length - FOLDED_COUNT : 0,
  };
}
