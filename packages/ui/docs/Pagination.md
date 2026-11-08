---
category: Actions
---

## Props

공통 props(className·style·render·ref)는 모든 컴포넌트가 받는다.

```ts
interface PaginationProps {
  page: number; // 현재 쪽. 1부터 센다
  totalPages: number; // 전체 쪽 수. 1 이하면 아무것도 그리지 않는다
  hrefFor: (page: number) => string; // 쪽 번호를 받아 링크 주소를 돌려준다
  siblings?: number; // 기본 2. 현재 쪽 양옆으로 보일 번호 수
  renderLink?: (href: string) => ReactElement; // 라우터 링크로 바꿀 때 쓴다. 없으면 일반 a 태그
}
```

## 언제 쓰나

구인 글 목록, 참여 기록처럼 쪽 단위로 나뉜 긴 목록의 아래에 쓴다.

## 쓰지 않을 때

쪽 개념이 없는 더 보기 버튼이나 무한 스크롤에는 쓰지 않는다. 그런 자리는 `Button`을 쓴다.

## 함께 쓰는 것

`hrefFor`가 검색 조건을 포함한 주소를 돌려주면 필터를 유지한 채 쪽을 옮길 수 있다. 앱 라우터를 쓴다면 `renderLink`로 링크 컴포넌트를 넘긴다.

## 예제

```tsx
<Pagination page={2} totalPages={8} hrefFor={(page) => `/games?page=${page}`} />
```

```tsx
<Pagination
  page={1}
  totalPages={3}
  siblings={1}
  hrefFor={(page) => `/sessions?page=${page}`}
  renderLink={(href) => <Link href={href} />}
/>
```

## data-* · 접근성

`nav`(`aria-label="페이지네이션"`) 안에 `data-slot="pagination"`. 쪽 번호는 `data-slot="pagination-item"`에 `data-state`(`active` · `inactive`)와 `aria-current="page"`가 붙고, 이전·다음은 `pagination-previous`·`pagination-next`다. 끝 쪽에서 막힌 화살표는 `data-disabled`가 붙은 span이다.
