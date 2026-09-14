# 롤앤콜 UI (@trpg/ui) — how to build with it

Mobile-first Korean TRPG session app (recruiting posts, rosters, schedule coordination). Screens are a 320–412px column. Write UI copy in Korean.

## Setup
No provider or wrapper is needed — every component is a plain React component on `window.TrpgUI`. Everything is styled by `styles.css` (Tailwind v4 output + design tokens + Pretendard from jsDelivr). Put page content on `bg-surface` inside a `bg-canvas` body.

## Styling idiom — Tailwind utilities backed by tokens
- **Components carry the look through props, not classes**: `Button variant="solid|outline|tinted|confirm|ghost|danger|discord" size="sm|md|lg" loading`, `Badge color="primary|success|gray|danger|discord"`, `Chip shape="pill|block" selected`, `Card padding="none|sm|md|lg" interactive`, `Text typography="display1|heading1|heading2|heading3|subtitle1|subtitle2|body1|body2|body3|body4|code1|code2" foreground="normal|muted|hint|primary|success|danger|white"`, `Progress color="recruiting|confirmed|closed"`, `TextInput/Textarea invalid`, layout via `VStack/HStack/Flex gap={0|1|2|3|4|5|6|8|10|12} align justify wrap`.
- **Only utilities compiled into `styles.css` exist.** It is a Tailwind build scanned from the library source, not the full framework — an arbitrary class (`p-7`, `bg-sky-500`) silently does nothing. For your own layout glue, prefer the layout components and their props, and fall back to inline `style` using token variables.
- **Colors are CSS variables** (`var(--color-*)`), with `.dark` on an ancestor swapping them: `surface`, `canvas`, `gray-50…900`, `primary-50…700` + `primary-ink`, `success-50…800` + `success-solid`, `danger-50…600` + `danger-solid`, `tinted-bg|bg-hover|border|ink`, `hint`, `discord`, `toast`, `heat-0…5`. Never hard-code hex; use `var(--color-gray-200)` etc.
- Common verified utilities: `bg-surface`, `bg-canvas`, `text-hint`, `text-gray-600`, `text-gray-900`, `border-gray-200`, `bg-primary-600`, `text-danger-600`, `bg-tinted-bg`, `text-tinted-ink`.

## Where the truth lives
`_ds/<folder>/styles.css` (tokens under `@theme`/`.dark`, every compiled utility) and each component's `<Name>.prompt.md` / `<Name>.d.ts`. `Select` is a compound object: `Select.Root items defaultValue` > `Select.Trigger placeholder invalid` + `Select.Popup` > `Select.Item value`. Wrap inputs in `Field label required description error`. Icons are not included — use inline SVG with `currentColor` inside `IconButton aria-label`.

## Example
```tsx
const { Card, VStack, HStack, Text, Badge, Progress, Button } = window.TrpgUI;

<Card interactive>
  <VStack gap={2}>
    <HStack justify="between" align="center">
      <Text typography="heading3">크툴루의 부름 — 안개 속의 저택</Text>
      <Badge color="primary">모집 중</Badge>
    </HStack>
    <Text typography="body3" foreground="muted">9월 20일 (토) 오후 8:00 · GM 김루키</Text>
    <Progress value={3} max={5} />
    <Button size="lg" className="w-full">참여하기</Button>
  </VStack>
</Card>
```
