---
category: Forms
---

## Props

`CheckboxGroup`은 `Root` 하나뿐이며 Base UI `CheckboxGroup.Root`를 그대로 쓴다. 공통 props(className·style·render·ref)도 Base UI가 받는 범위를 따른다.

```ts
CheckboxGroup.Root; // Base UI CheckboxGroup.Root 그대로 (value·onValueChange·aria-label 등)
```

## 언제 쓰나

체크박스 여럿을 한 값 목록으로 묶을 때 쓴다. 예를 들어 감사 로그에서 조치 종류를 여러 개 고르거나, 참여자 권한 여러 개를 함께 고르는 자리다.

## 쓰지 않을 때

체크박스가 하나뿐이거나 서로 관계없는 독립 설정이면 `Checkbox.Root`만 쓴다. 하나만 고르는 목록은 `Radio`나 `RadioGroup`을 쓴다.

## 함께 쓰는 것

안에 `Checkbox.Field`(+ `Checkbox.Root`, `Checkbox.Indicator`, `Checkbox.Label`)를 항목 수만큼 둔다. 목록 전체에는 `aria-label`로 무엇을 고르는지 이름을 붙인다.

## 예제

```tsx
<CheckboxGroup.Root value={selectedKinds} onValueChange={setSelectedKinds} aria-label="조치 종류">
  <VStack gap="050">
    {kinds.map((kind) => (
      <Checkbox.Field key={kind.label}>
        <Checkbox.Root name={kind.label} value={kind.label}>
          <Checkbox.Indicator />
        </Checkbox.Root>
        <Checkbox.Label>{kind.label}</Checkbox.Label>
      </Checkbox.Field>
    ))}
  </VStack>
</CheckboxGroup.Root>
```

```tsx
<CheckboxGroup.Root value={selectedRoles} onValueChange={setSelectedRoles} aria-label="참여자 권한">
  <Text typography="body4" foreground="muted">
    권한을 골라 주세요
  </Text>
  <Checkbox.Field>
    <Checkbox.Root name="role" value="gm">
      <Checkbox.Indicator />
    </Checkbox.Root>
    <Checkbox.Label>GM 권한</Checkbox.Label>
  </Checkbox.Field>
</CheckboxGroup.Root>
```

## data-* · 접근성

`CheckboxGroup.Root`에는 이 프로젝트가 붙이는 `data-slot`이 없다. 그룹 상태는 Base UI가 붙이는 속성을 따른다. 목록 이름은 `aria-label`로 준다. 항목 접근성은 `Checkbox.md`를 따른다.
