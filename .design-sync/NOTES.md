# design-sync notes (@trpg/ui)

- `packages/ui` has no build and no shipped CSS: its `package.json` exports `src/index.ts` and `src/styles.css` is Tailwind v4 *source* (`@theme`, `@source`). `cfg.buildCmd` does two things before the converter:
  1. `tsc --emitDeclarationOnly --outDir dist/types` so ts-morph finds `.d.ts` (dts.mjs looks in `dist/types`). `select.tsx` fails TS2742 and emits no `.d.ts` - hence `cfg.dtsPropsFor.Select`.
  2. Tailwind CLI compiles `.design-sync/tailwind-input.css` -> `packages/ui/dist/design-sync.css` (cssEntry must live inside the package). The input `@source`s both `packages/ui/src` and `.design-sync/previews`, so classes used only in previews compile too. Recompile after editing previews.
- Components aren't discovered from `.d.ts` (the converter reads `<pkg>/index.d.ts`, which doesn't exist), so `cfg.componentSrcMap` enumerates all 22 exports. **Add a new component there** or it won't sync.
- Converter invocation: `--node-modules apps/web/node_modules --entry packages/ui/src/index.ts` (react-dom is only installed under apps/web).
- `.ds-sync` deps installed with `pnpm add --ignore-workspace`; playwright pinned to 1.61.0 to match the cached `chromium-1228`.
- Pretendard ships as a real font: `.design-sync/fonts/PretendardVariable.woff2` (v1.3.9, OFL, user-approved) + `pretendard.css` via `cfg.extraFonts`. Don't put a remote `@import url()` in the tailwind input - cssEntry is *appended* into `_ds_bundle.css`, so a mid-file `@import` is invalid and silently ignored ([FONT_MISSING]).
- Known render warns: `[GRID_OVERFLOW]` Avatar/Sizes (7 sizes up to 84px) -> `cfg.overrides.Avatar.cardMode = "column"`.
- `Select` is a compound object (`Select.Root/Trigger/Popup/Item`), not a component - the floor card errors "Element type is invalid"; it needs the authored preview.
- Dark mode = `.dark` class on an ancestor (see `packages/ui/src/styles.css`); previews render light only.

## Re-sync risks
- **Compiled-utility ceiling**: `styles.css` holds only Tailwind classes found in `packages/ui/src` + `.design-sync/previews`. The conventions header tells the design agent this; if designs come out unstyled, widen `@source` in `tailwind-input.css` (e.g. add `apps/web/src`) and rebuild.
- **`componentSrcMap` is a hand enumeration** of `packages/ui/src/index.ts` exports - a new/renamed export silently won't sync. Diff it against `index.ts` on every re-sync.
- **`dtsPropsFor.Select` is hand-written** because tsc can't emit `select.d.ts` (TS2742). Re-check it if `select.tsx` props change.
- **Pretendard is vendored at v1.3.9** in `.design-sync/fonts/`; if `apps/web/src/app/layout.tsx` bumps the CDN version, re-download.
- **Toolchain pins**: Tailwind CLI 4.3.3 (matches `apps/web`), playwright 1.61.0 (matches cached `chromium-1228`). A different cache revision needs a different playwright.
- All 22 previews were authored and graded `good` on the absolute rubric; no human review of `.review.html` was recorded.
