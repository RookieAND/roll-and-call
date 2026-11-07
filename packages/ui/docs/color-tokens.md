# 색 토큰 메모

역할 토큰은 모두 `src/styles.css`에서 팔레트(`--rc-color-<색>-<단>`)를 가리킨다. hex를 직접 적지 않는다. 여기에는 쓰임이 좁아 따로 적어 둘 토큰만 모은다.

## 순위 (금·은·동)

| 토큰                           | Tailwind                             | 라이트    | 다크      |
| ------------------------------ | ------------------------------------ | --------- | --------- |
| `--rc-color-fg-rank-gold`      | `text-rank-gold`, `bg-rank-gold`     | gold-700  | gold-350  |
| `--rc-color-fg-rank-silver`    | `text-rank-silver`, `bg-rank-silver` | gray-600  | gray-300  |
| `--rc-color-fg-rank-bronze`    | `text-rank-bronze`, `bg-rank-bronze` | amber-600 | amber-250 |
| `--rc-color-bg-rank-silver`    | (배지 은 바탕)                       | gray-050  | gray-850  |
| `--rc-color-shine-rank-silver` | (배지 은 반짝임)                     | gray-000  | gray-050  |

명암비(라이트는 흰 바탕 `canvas-base`, 다크는 gray-950 기준): 금 5.48 / 9.38, 은 6.30 / 8.05, 동 5.02 / 8.76. 두 테마 모두 본문 글자 기준(4.5:1)을 넘으므로 숫자와 아이콘에 그대로 쓴다. 순위 색은 이달의 기록 시상대, 배지 단계, 업적 도감처럼 1·2·3위나 금·은·동 단계를 뜻할 때만 쓴다.

## 토스트 아이콘

토스트 바탕(`bg-toast`)은 두 테마 모두 어두워서 아이콘과 설명 글자는 밝은 단을 쓴다. 라이트와 다크가 같은 값이다.

| 토큰                             | Tailwind             | 값        | 명암비(라이트 gray-900 / 다크 gray-800 바탕) |
| -------------------------------- | -------------------- | --------- | -------------------------------------------- |
| `--rc-color-fg-on-toast-success` | `text-toast-success` | green-300 | 9.85 / 7.36                                  |
| `--rc-color-fg-on-toast-warning` | `text-toast-warning` | amber-300 | 8.99 / 6.72                                  |
| `--rc-color-fg-on-toast-danger`  | `text-toast-danger`  | red-300   | 6.22 / 4.65                                  |
| `--rc-color-fg-on-toast-muted`   | `text-toast-muted`   | gray-300  | 7.30 / 5.46                                  |
