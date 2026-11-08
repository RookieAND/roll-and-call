---
category: Selection
---

## Props

공통 props(className·style·render·ref)는 모든 하위 컴포넌트가 받는다. 아래는 Base UI 부품을 그대로 감싼 것이며, `Panel`만 높이 애니메이션을 위한 기본 클래스를 더 가진다.

```ts
Collapsible.Root: {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean, eventDetails) => void;
  disabled?: boolean;
  // 그 외 Base UI Collapsible.Root props를 그대로 받는다
}

Collapsible.Trigger // Base UI Collapsible.Trigger 그대로
Collapsible.Panel   // Base UI Collapsible.Panel 그대로. 고유 prop 없음
```

## 언제 쓰나

구인 상세의 참여 조건, 룰북 설명처럼 부가 정보를 펼쳐야 볼 수 있을 때 쓴다. 기본 정보는 항상 보이고 자세한 내용만 접어 둘 때 맞다.

## 쓰지 않을 때

목록에서 여러 항목을 한꺼번에 펼쳐 비교해야 하면 `Table`이나 행 목록이 낫다. 화면 한쪽에서 여는 긴 설명은 `Sheet`나 `Dialog`로 띄운다. 탭으로 나눌 수 있는 내용은 `Tabs`를 쓴다.

## 함께 쓰는 것

`Collapsible.Trigger` 안에는 제목과 펼침 표시(`ChevronDown` 같은 아이콘)를 둔다. `Collapsible.Panel`에는 본문을 넣는다. 카드 안에서는 `Card.Body` 아래에 둔다.

## 예제

```tsx
<Collapsible.Root>
  <Collapsible.Trigger>
    <HStack align="center" justify="between">
      <Text typography="body3" weight="medium">
        참여 조건 보기
      </Text>
      <ChevronDown size={16} aria-hidden />
    </HStack>
  </Collapsible.Trigger>
  <Collapsible.Panel>
    <VStack gap="050" className="pt-100">
      <Text typography="body4" foreground="muted">
        초심자 환영 · 준비물은 GM이 안내합니다
      </Text>
    </VStack>
  </Collapsible.Panel>
</Collapsible.Root>
```

```tsx
<Collapsible.Root defaultOpen>
  <Collapsible.Trigger>
    <Text typography="body3" weight="medium">
      룰북 설명
    </Text>
  </Collapsible.Trigger>
  <Collapsible.Panel>
    <Text typography="body4" foreground="muted">
      크툴루의 부름 기본 룰북 기준으로 진행합니다.
    </Text>
  </Collapsible.Panel>
</Collapsible.Root>
```

## data-* · 접근성

`data-slot`: `collapsible`(Root) · `collapsible-trigger` · `collapsible-panel`. `Panel`은 높이를 `--collapsible-panel-height`로 옮겨 `duration-200`으로 여닫는다. 모션을 줄이기로 한 사용자에게는 즉시 바뀐다(`motion-reduce`). 열림·닫힘 상태와 Trigger의 펼침 정보 연결은 Base UI가 맡는다.
