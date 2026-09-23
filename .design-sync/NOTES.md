# design-sync 메모 (@roll-and-call/ui)

- 이 패키지는 **빌드 스크립트가 없다**. 변환기가 쓸 `dist/`는 `tsconfig.build.json`으로 만든다(`cfg.buildCmd`가 그 명령이다). `package.json`의 `types` 필드가 없으면 변환기가 선언 파일을 못 찾아 `[ZERO_MATCH]`가 난다 — `"types": "./dist/index.d.ts"`를 유지할 것.
- `src/select.tsx`의 `Select` 객체에는 **명시 타입이 필요하다**. 없으면 TS2742로 `dist/select.d.ts`가 통째로 빠진다.
- `react-dom`이 `packages/ui/node_modules`에 없다(peer가 아니라 앱에만 있다). 변환기 번들이 실패하므로 `packages/ui/node_modules/react-dom` → `apps/web/node_modules/react-dom` 심볼릭 링크를 만들어 둔다. 클론마다 다시 만들어야 한다.
- CSS는 `.design-sync/tailwind-entry.css`를 Tailwind CLI로 컴파일해 `packages/ui/dist/design-sync.css`로 내보낸 것을 `cfg.cssEntry`로 쓴다. **토큰은 `cfg.tokensGlob = src/styles.css`**로 따로 잡는다 — 컴파일 결과를 토큰으로 넘기면 `--tw-*`·`--default-*` 같은 Tailwind 내부 변수가 디자인 토큰으로 분류된다(예전 동기화에서 실제로 경고가 났다).
- 폰트: 앱은 Pretendard를 jsDelivr CDN으로 받지만 번들에는 `@font-face`가 필요하다. `.design-sync/fonts/`에 가변 woff2와 `pretendard.css`를 두고 `cfg.extraFonts`로 싣는다. `--font-sans`가 "Pretendard Variable"과 "Pretendard" 두 이름을 쓰므로 **@font-face도 두 벌** 필요하다.
- 미리보기 export 이름은 **ASCII PascalCase**여야 한다. 한글 식별자로 쓰면 `window.__dsCells`가 비어 캡처가 실패한다(문구는 한국어 그대로 쓴다).
- playwright는 캐시된 크로미움(`chromium-1228`)과 맞는 **1.61.0**을 `.ds-sync`에 설치한다. 최신 버전은 1243을 요구해 실행이 안 된다.

## 알려진 렌더 경고

- `[TOKENS_MISSING]`: `--cds-*`(Base UI 내부), `--collapsible-panel-height`, `--active-tab-width` 등은 컴포넌트가 런타임에 넣는 값이라 스타일시트에 없는 게 정상이다.
- 카드 안에서는 `#r0.ds-single`에 항등 `transform`이 걸려 있어 **`position: fixed`가 뷰포트가 아니라 카드 상자를 기준**으로 잡힌다. 포털을 쓰는 Dialog·Sheet는 영향이 없지만, Toast(sonner)와 FloatingBar는 인라인 fixed라 카드 높이를 따라간다. 그래서 두 미리보기는 화면 역할을 하는 높이 360px 상자를 두고, 설정에서 `cardMode: "single"` + `viewport`를 준다.
- 미리보기에서 토스트는 `duration`을 크게 줘야 캡처 시점까지 남아 있다.
- Tooltip은 `defaultOpen`으로 열린 모습을 보여 준다(2026-09-23에 컴포넌트에 prop을 열었다).
- `Text`는 기본이 인라인 `span`이다. `Card.Root` 같은 블록 안에 Text 두 개를 나란히 두면 한 줄로 붙으므로 `VStack`으로 감싼다.
- `Card`·`Grid`의 `radius`는 숫자 리터럴(`radius={500}`)이다. 문자열이 아니다.

## 2026-09-23 동기화에서 컴포넌트에 고친 것
- `text-field-variants.ts`에 `disabled` 스타일이 없어 비활성 입력이 평소와 똑같이 보였다 → `disabled:bg-gray-50 disabled:opacity-50` 추가.
- Tabs의 `data-[variant=…]` 규칙이 Trigger 자신을 보고 있어 한 번도 걸리지 않았다 → 조상 List를 보도록 `[[data-variant=…]_&]`로 바꾸고, solid에서 선택 탭에 배경을 준다(Indicator는 solid에서 숨긴다).

## 다시 동기화할 때 조심할 것

- `.design-sync/fonts/PretendardVariable.woff2`(2MB)는 CDN에서 받아 레포에 넣은 것이다. 폰트 버전을 올릴 때는 `tailwind-entry.css`의 CDN `@import` 버전과 이 파일을 함께 바꾼다.
- `.design-sync/tailwind-entry.css`의 `@source inline(...)` 목록이 **디자인 쪽이 쓸 수 있는 유틸리티의 전부**다. 토큰을 새로 추가하면 여기에도 넣어야 디자인에서 쓸 수 있다.
- 미리보기에서 값을 인라인으로 박아 둔 곳은 없다. 다만 Toast·FloatingBar 미리보기는 카드 높이(360px·320px)에 기대고 있어, `cfg.overrides`의 viewport를 바꾸면 같이 조정해야 한다.
- 캡처 시점에 남아 있어야 해서 Toast 미리보기는 `duration`을 크게 준다. 실제 기본값(4초)과 다르다.
- 이번 회차에서 확인하지 못한 것: Select 팝업이 열린 모습(포털이라 정적 캡처에 안 잡힌다), hover·drag 상태.
- 빌드가 전제하는 것: Node 22, pnpm 11, Tailwind CLI 4.3.3(`pnpm dlx`로 매번 받는다), playwright 1.61.0 + 캐시된 chromium-1228.

## 알려진 렌더 경고 (추가)

- `[RENDER_THIN] ... rendered height is 0px`: Dialog·AlertDialog·Sheet는 포털로 body에 그려서 카드 루트 높이가 0이다. 스크린샷은 정상이다.
- **컴파운드의 .d.ts는 조각 목록만 나온다.** `export const Sheet = {...}` 같은 네임스페이스 객체는 변환기가 각 조각의 props를 못 뽑아 `React.ComponentType<any>`로 적는다. 그래서 디자인 에이전트가 읽는 실제 계약은 `packages/ui/docs/<이름>.md`(→ prompt.md)의 Props 절이다. 컴파운드 API를 바꾸면 그 문서도 같이 고친다.
- 그룹을 바꾸면(components/<group>/<Name>) **옛 경로가 원격에 남는다.** diff의 `upload.deletePaths`는 앵커가 알던 경로만 담아서, 앵커에 없던 조합은 빠진다. 업로드 뒤 `list_files`로 `components/general/` 잔재를 꼭 확인하고 지운다.
- 문서를 새로 붙이면 그 컴포넌트의 등급이 지워진다(prompt.md가 캡처 키에 들어간다). 문서 작업과 채점은 같은 회차에 몰아서 한다.
