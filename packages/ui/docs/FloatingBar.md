---
category: Overlays
---

## Props

`FloatingBar`는 조각을 묶은 복합 컴포넌트다. 공통 props(className·style·render·ref)는 `Content`가 받는다.

```ts
FloatingBar.Root: {
  elevated?: boolean; // 기본 true. 위 본문과 겹칠 때 위쪽 그림자를 준다. 바닥까지 내려가면 그림자가 빠진다
  safeArea?: boolean; // 기본 true. 기기 아래쪽 안전 영역만큼 여백을 더한다
  hidden?: boolean; // 비워 두면 시트·다이얼로그가 열려 있는 동안 스스로 숨는다
  children: ReactNode;
}

FloatingBar.Content: {
  className?: string;
  style?: CSSProperties;
  render?: RenderProp; // 상태는 elevated(그림자 여부)·hidden을 받는다
  children: ReactNode;
}

FloatingBar.Spacer: {
  // 고유 prop 없음. 바 높이만큼 빈 자리를 본문 끝에 만든다
}
```

## 언제 쓰나

화면 하단에 주 액션 하나를 계속 붙여 둬야 할 때 쓴다. 예: 구인 등록하기, 참여 확정.

## 쓰지 않을 때

화면 안에서 흐르는 버튼이면 `Button`을 본문에 둔다. 상단 고정 바는 이 컴포넌트가 아니다.

## 함께 쓰는 것

본문 끝에 `FloatingBar.Spacer`를 꼭 같이 둔다. 그래야 마지막 내용이 바에 가려지지 않는다. 바 안에는 `Button`(`size="lg"`)을 `className="w-full"`로 넣는 경우가 흔하다.

## 예제

```tsx
<FloatingBar.Root>
  <FloatingBar.Content>
    <Button size="lg" className="w-full">
      구인 등록하기
    </Button>
  </FloatingBar.Content>
  <FloatingBar.Spacer />
</FloatingBar.Root>
```

```tsx
<FloatingBar.Root elevated={false}>
  <FloatingBar.Content>
    <HStack gap="100">
      <Button variant="outline" colorPalette="primary">
        임시 저장
      </Button>
      <Button colorPalette="primary">참여 신청</Button>
    </HStack>
  </FloatingBar.Content>
  <FloatingBar.Spacer />
</FloatingBar.Root>
```

## data-* · 접근성

`Content`는 `data-slot="floating-bar"`다. `hidden`이면 `aria-hidden`과 `inert`가 붙고 화면에서 숨는다. `Spacer`는 `data-slot="floating-bar-spacer"`이며 `aria-hidden`이다. 기본 태그는 `<div>`다.
