---
category: Display
---

## Props

`Avatar`는 아래 props만 받는다. `render`·`ref`·`style`은 받지 않는다.

```ts
interface AvatarProps {
  src?: string | null; // 이미지 주소. 없거나 불러오지 못하면 이름의 첫 글자로 대신한다
  name?: string | null; // 첫 글자와 배경색을 정하고, 호버하면 툴팁으로 보여준다
  size?: "sm" | "md" | "stack" | "lg" | "xl" | "2xl" | "3xl"; // 기본 md(32px). sm=24px, lg=48px, xl=52px, 2xl=60px, 3xl=84px. stack은 겹쳐 쌓는 자리용(34px 정사각)
  className?: StateClassName<{ size: "sm" | "md" | "stack" | "lg" | "xl" | "2xl" | "3xl" }>; // 함수형 className 가능
}
```

## 언제 쓰나

GM·참여자처럼 사람 한 명을 작게 나타낼 때 쓴다. 이름 옆에 붙이거나 카드 헤더에 둔다. 사진이 없는 사람도 이름만으로 구분되도록 색과 첫 글자가 자동으로 정해진다.

## 쓰지 않을 때

여러 명을 한 줄로 요약해 보여줄 때는 `AvatarGroup`을 쓴다. 이름을 옆에 나란히 전부 적어야 하는 목록은 Avatar만 두지 말고 행 단위 레이아웃을 쓴다.

## 함께 쓰는 것

`Card.Header` 안에서 `HStack`과 `Text`로 이름을 붙이거나, `Card.Root interactive` 안의 참여자 행에 둔다. 여러 명이면 `AvatarGroup`이 같은 `size`를 맞춰 준다.

## 예제

```tsx
<HStack align="center" gap="100">
  <Avatar src={member.avatarUrl} name={member.username} size="lg" />
  <VStack gap="025">
    <Text typography="subtitle1" weight="bold">
      달빛
    </Text>
    <Text typography="body4" foreground="muted">
      GM
    </Text>
  </VStack>
</HStack>
```

```tsx
<HStack align="center" gap="100">
  <Avatar name="새벽" size="sm" />
  <Text typography="body3" weight="medium">
    새벽
  </Text>
</HStack>
```

```tsx
<Avatar size="md" />
```

## data-* · 접근성

`data-slot="avatar"`(`span`). 상태 속성: `data-size`(size가 있을 때). 이미지가 있으면 `alt`에 이름이 들어가고, 이미지가 실패하면 첫 글자 표시로 바뀐다. `name`이 있으면 `Tooltip`이 감싸며, 이름이 없으면 `?`를 보여준다. 이미지는 `img`로 그려지며 Discord CDN 같은 외부 주소에 next/image 설정이 필요 없다.
