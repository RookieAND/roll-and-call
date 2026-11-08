---
category: Display
---

## Props

`AvatarGroup`은 아래 props만 받는다. `render`·`ref`·`style`은 받지 않는다.

```ts
interface AvatarGroupProps {
  people: { src?: string | null; name?: string | null }[]; // 필수. Avatar와 같은 값을 받는다
  max?: number; // 기본 3. 넘는 사람은 "+N" 칩으로 묶는다
  size?: "sm" | "md" | "stack" | "lg" | "xl" | "2xl" | "3xl"; // Avatar와 같다. 기본 md
  className?: StateClassName<{
    size: "sm" | "md" | "stack" | "lg" | "xl" | "2xl" | "3xl";
    count: number;
  }>; // 함수형 className 가능
}
```

## 언제 쓰나

구인 카드나 세션 상세에서 참여자 여럿을 겹쳐 한 줄로 요약할 때 쓴다. 전체 인원보다 "누가 모였는지"가 먼저 보여야 하는 자리다.

## 쓰지 않을 때

한 명만 보여줄 때는 `Avatar`를 쓴다. 참여자마다 역할·상태를 함께 보여줘야 하면 행 목록을 쓴다.

## 함께 쓰는 것

`Card.Body` 안에서 정원 표시(`Text`)와 나란히 둔다. 같은 줄에 `Badge`를 붙이기도 한다.

## 예제

```tsx
<HStack align="center" gap="100">
  <AvatarGroup
    people={[
      { name: "달빛", src: null },
      { name: "새벽", src: null },
      { name: "별바다", src: null },
      { name: "은하수", src: null },
    ]}
    max={3}
    size="md"
  />
  <Text typography="body4" foreground="muted">
    정원 4/6
  </Text>
</HStack>
```

```tsx
<AvatarGroup
  people={game.members.map((member) => ({ name: member.username, src: member.avatarUrl }))}
  max={5}
  size="sm"
/>
```

## data-* · 접근성

`data-slot="avatar-group"`(`div`). 넘친 칩은 `data-slot="avatar-group-overflow"`이며 `Tooltip`으로 숨은 참여자 이름을 쉼표로 이어 보여준다(이름이 없으면 "N명 더"). 칩의 글자는 `+N` 형식이다. 개별 Avatar의 접근성은 `Avatar.md`를 따른다.
