# @roll-and-call/ui 2차 개편 마이그레이션

PR 2에서 한 번에 깬 변경이다. 어드민처럼 새로 시작하는 앱은 이 문서의 "후" 쪽만 보면 된다.

## prop 규칙

1. 시각 옵션은 열거형, 상태는 불린이다. 열거형은 `variant`(모양) · `colorPalette`(색) · `size` 셋뿐이다.
2. 상태 불린은 `disabled · loading · invalid · required · readOnly · checked · selected · interactive`만 쓴다.
3. 도메인 어휘(모집 중, 확정 같은 것)는 디자인 시스템에 넣지 않는다. 앱 레이어 상수가 팔레트로 옮긴다.

`Text foreground`만 예외로 전경 역할(`normal · muted · hint · primary · success · successStrong · warning · danger · onPrimary · inverse · inherit`)을 받는다.

## 변경 표

| 전                                 | 후                                                                          |
| ---------------------------------- | --------------------------------------------------------------------------- |
| `<Button variant="solid">`         | 그대로 (기본값 `colorPalette="primary"`)                                    |
| `<Button variant="confirm">`       | `variant="solid" colorPalette="success"`                                    |
| `<Button variant="danger">`        | `variant="outline" colorPalette="danger"`                                   |
| `<Button variant="destructive">`   | `variant="solid" colorPalette="danger"`                                     |
| `<Button variant="discord">`       | `variant="solid" colorPalette="discord"`                                    |
| `<Button asChild><Link/></Button>` | `<Button render={<Link />}>라벨</Button>` (`Chip`·`IconButton`도 같다)      |
| `<Badge color>`                    | `<Badge colorPalette>`                                                      |
| `<Progress color="recruiting">`    | 기본값 (`variant="solid" colorPalette="primary"`)                           |
| `<Progress color="waiting">`       | `variant="tinted"`                                                          |
| `<Progress color="confirmed">`     | `colorPalette="success"`                                                    |
| `<Progress color="closed">`        | `colorPalette="gray"`                                                       |
| `<Text foreground="white">`        | `foreground="onPrimary"` (늘 흰 글씨) 또는 `inverse`(테마에 따라 뒤집힘)    |
| `<Card>`                           | `<Card.Root>` (+ `Header` · `Body` · `Footer`)                              |
| `<Field>`                          | `<Field.Root>` (+ `Label` · `Description` · `Error`)                        |
| `<Callout tone icon title action>` | `<Callout.Root colorPalette>` + `Icon` · `Title` · `Description` · `Action` |
| `<SegmentControl options>`         | `<SegmentedControl.Root>` + `<SegmentedControl.Item>`                       |
| `<Switch checked onCheckedChange>` | `<Switch.Root>` + `<Switch.Control />` (+ `Label`)                          |
| `.dark` 클래스                     | `data-theme="dark"` 속성                                                    |

## 새로 생긴 것

`Sheet` · `FloatingBar` · `Toast` · `Table` · `Dialog` / `AlertDialog` · `Tabs` · `Checkbox` / `CheckboxGroup` · `Radio` / `RadioGroup` / `RadioCard`.

## 색 토큰

프리미티브(`--rc-color-gray-050` 등)는 값의 사다리이고, 화면 코드는 역할 토큰(`--rc-color-bg-*` · `fg-*` · `border-*`)만 읽는다.
Tailwind 유틸리티 이름(`bg-surface`, `text-gray-600`)은 그대로 쓰되, 역할이 없는 숫자 램프는 `--rc-legacy-*`를 거친다. 이 별칭들은 사용처가 역할 유틸리티로 옮겨 가면 지운다.
